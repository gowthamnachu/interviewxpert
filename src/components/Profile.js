// ...existing imports...

const Profile = () => {
  // ...existing state...

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Fetching certificates from:', `${config.apiUrl}/certificates/user`);
      const response = await axios.get(`${config.apiUrl}/certificates/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Certificates response:', response.data);
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError('Failed to load certificates. Please try again later.');
    }
  };

  // ...rest of component...
};

export default Profile;
