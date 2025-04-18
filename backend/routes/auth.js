const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OTP = require("../models/OTP");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose) => {
  const subject = purpose === "verify" ? "Account Verification" :
                 purpose === "login" ? "Login OTP" :
                 "Password Reset OTP";

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: `<p>Your OTP for ${subject} is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`
  });
};

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include a number and special character"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        error: "Username or email already exists"
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate and send verification OTP
    const otp = generateOTP();
    await new OTP({ userId: user._id, email, otp, purpose: "verify" }).save();
    await sendOTPEmail(email, otp, "verify");

    res.status(201).json({
      message: "Registration successful. Please verify your email."
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Verify email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      purpose: "verify"
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    user.isVerified = true;
    await user.save();
    await OTP.deleteMany({ email, purpose: "verify" });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, email, password, loginMethod } = req.body;
    const query = username ? { username } : { email };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Please verify your email first" });
    }

    if (user.isLocked()) {
      return res.status(400).json({
        error: "Account is temporarily locked. Please try again later"
      });
    }

    if (loginMethod === "password") {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await user.incrementLoginAttempts();
        return res.status(400).json({ error: "Invalid password" });
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();

    } else if (loginMethod === "otp") {
      if (user.otpLockUntil && user.otpLockUntil > Date.now()) {
        return res.status(400).json({
          error: "OTP login is temporarily locked. Please try again later"
        });
      }

      const otp = generateOTP();
      await new OTP({ userId: user._id, email: user.email, otp, purpose: "login" }).save();
      await sendOTPEmail(user.email, otp, "login");

      return res.json({ message: "OTP sent to your email" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify login OTP
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      purpose: "login"
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    const user = await User.findOne({ email });

    if (otpRecord.otp !== otp) {
      const isMaxAttempts = await otpRecord.incrementAttempts();
      if (isMaxAttempts) {
        user.otpLockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        await user.save();
        await OTP.deleteMany({ email, purpose: "login" });
        return res.status(400).json({
          error: "Too many failed attempts. OTP login locked for 30 minutes"
        });
      }
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await OTP.deleteMany({ email, purpose: "login" });
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "OTP verification failed" });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const otp = generateOTP();
    await new OTP({ userId: user._id, email, otp, purpose: "reset" }).save();
    await sendOTPEmail(email, otp, "reset");

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send reset OTP" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long and include a number and special character"
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      purpose: "reset"
    }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await OTP.deleteMany({ email, purpose: "reset" });

    // Send password change notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed Successfully",
      html: "<p>Your password has been changed successfully. If you didn't make this change, please contact support immediately.</p>"
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
});

module.exports = router;