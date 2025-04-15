require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB Connected");
  seedDatabase(); // Call function to seed data once connected
}).catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

const seedDatabase = () => {
  const questions = [
    // Mock Questions - Software Engineering
    
      {
          domain: "Software Engineering",
          text: "Which design pattern allows an object to alter its behavior when its internal state changes?",
          expected: ["state", "behavior", "pattern", "object", "design"],
          options: [
              "Adapter Pattern",
              "State Pattern",
              "Strategy Pattern",
              "Chain of Responsibility Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The State Pattern allows an object to alter its behavior when its internal state changes, making state transitions more manageable."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern provides a way to create objects while hiding the creation logic?",
          expected: ["factory", "creation", "pattern", "objects", "design"],
          options: [
              "Singleton Pattern",
              "Observer Pattern",
              "Decorator Pattern",
              "Factory Pattern"
          ],
          correctOption: 3,
          isMockQuestion: true,
          answer: "The Factory Pattern provides a way to create objects while hiding the creation logic, allowing for more flexible and scalable code."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern allows for adding new functionality to an existing object without altering its structure?",
          expected: ["decorator", "functionality", "pattern", "object", "design"],
          options: [
              "Composite Pattern",
              "Decorator Pattern",
              "Adapter Pattern",
              "Proxy Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Decorator Pattern allows for adding new functionality to an existing object without altering its structure, promoting the single responsibility principle."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified?",
          expected: ["observer", "dependency", "pattern", "objects", "design"],
          options: [
              "Mediator Pattern",
              "Observer Pattern",
              "Chain of Responsibility Pattern",
              "Command Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Observer Pattern defines a one-to-many dependency between objects, enabling a notification mechanism for state changes."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern allows an interface to be created that can adapt for different clients?",
          expected: ["adapter", "clients", "pattern", "interface", "design"],
          options: [
              "Adapter Pattern",
              "Facade Pattern",
              "Proxy Pattern",
              "Strategy Pattern"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The Adapter Pattern allows an interface to be created that can adapt for different clients, facilitating compatibility between incompatible interfaces."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern separates the construction of a complex object from its representation?",
          expected: ["builder", "construction", "pattern", "object", "design"],
          options: [
              "Builder Pattern",
              "Prototype Pattern",
              "Factory Method Pattern",
              "Composite Pattern"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The Builder Pattern separates the construction of a complex object from its representation, allowing for a consistent construction process."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern is used to create a clone of an existing object?",
          expected: ["prototype", "clone", "pattern", "object", "design"],
          options: [
              "Factory Method Pattern",
              "Singleton Pattern",
              "Prototype Pattern",
              "Builder Pattern"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "The Prototype Pattern is used to create a clone of an existing object, allowing for creating new instances with the same properties."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern encapsulates a request as an object, thereby allowing for parameterization of clients?",
          expected: ["command", "request", "pattern", "object", "design"],
          options: [
              "Interpreter Pattern",
              "Command Pattern",
              "Visitor Pattern",
              "Memento Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Command Pattern encapsulates a request as an object, allowing for request parameterization and queuing of operations."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern simplifies a complex system by providing a unified interface to a set of interfaces in a subsystem?",
          expected: ["facade", "subsystem", "pattern", "interface", "design"],
          options: [
              "Facade Pattern",
              "Bridge Pattern",
              "Adapter Pattern",
              "Strategy Pattern"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The Facade Pattern simplifies a complex system by providing a unified interface to a set of interfaces, making it easier to use."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern provides a way to compose objects into tree structures to represent part-whole hierarchies?",
          expected: ["composite", "hierarchies", "pattern", "objects", "design"],
          options: [
              "Composite Pattern",
              "Decorator Pattern",
              "Builder Pattern",
              "Observer Pattern"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The Composite Pattern provides a way to compose objects into tree structures to represent part-whole hierarchies, promoting client-side simplicity."
      },
      {
          domain: "Software Engineering",
          text: "What design pattern allows for the separation of the algorithm from the behavior it controls?",
          expected: ["strategy", "algorithm", "pattern", "behavior", "design"],
          options: [
              "Observer Pattern",
              "State Pattern",
              "Mediator Pattern",
              "Strategy Pattern"
          ],
          correctOption: 3,
          isMockQuestion: true,
          answer: "The Strategy Pattern allows for the separation of the algorithm from the behavior it controls, enabling interchangeability."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern ensures a class has one instance and provides a global point of access?",
          expected: ["singleton", "instance", "pattern", "access", "design"],
          options: [
              "Proxy Pattern",
              "Singleton Pattern",
              "Mediator Pattern",
              "Adapter Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Singleton Pattern ensures a class has one instance and provides a global point of access to it, useful in situations like logging or configuration."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern defines an interface for building components of a complex object?",
          expected: ["builder", "interface", "components", "complex", "design"],
          options: [
              "Factory Method Pattern",
              "Builder Pattern",
              "Prototype Pattern",
              "Chain of Responsibility Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Builder Pattern defines an interface for building components of a complex object, enabling a step-by-step construction process."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern provides an interface for creating families of related or dependent objects?",
          expected: ["abstract", "factory", "pattern", "objects", "design"],
          options: [
              "Observer Pattern",
              "Abstract Factory Pattern",
              "Strategy Pattern",
              "Builder Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Abstract Factory Pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes."
      },
      {
          domain: "Software Engineering",
          text: "What design pattern allows an object to access the operations of another object while controlling its access?",
          expected: ["proxy", "access", "operations", "object", "design"],
          options: [
              "Decorator Pattern",
              "Adapter Pattern",
              "Proxy Pattern",
              "Composite Pattern"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "The Proxy Pattern allows an object to access the operations of another object while controlling its access, providing a surrogate."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern provides a way to traverse a collection without exposing its underlying representation?",
          expected: ["iterator", "traverse", "collection", "pattern", "design"],
          options: [
              "Visitor Pattern",
              "Iterator Pattern",
              "Memento Pattern",
              "Observer Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Iterator Pattern provides a way to traverse a collection without exposing its underlying representation, enhancing encapsulation."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern is used to represent an operation that may or may not happen as a result of altering an object's state?",
          expected: ["memento", "operation", "state", "pattern", "design"],
          options: [
              "Chain of Responsibility Pattern",
              "Memento Pattern",
              "Command Pattern",
              "Observer Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Memento Pattern is used to represent an operation that may or may not happen as a result of altering an object's state, allowing for state restoration."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern allows you to define a contract for a family of algorithms, encapsulating each one?",
          expected: ["strategy", "contract", "algorithms", "pattern", "design"],
          options: [
              "Mediator Pattern",
              "Strategy Pattern",
              "Template Method Pattern",
              "Visitor Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Strategy Pattern allows you to define a contract for a family of algorithms, encapsulating each one and making them interchangeable."
      },
      {
          domain: "Software Engineering",
          text: "What design pattern allows a class to defer its instantiation to subclasses?",
          expected: ["template", "method", "pattern", "instantiation", "design"],
          options: [
              "Chain of Responsibility Pattern",
              "Template Method Pattern",
              "Abstract Factory Pattern",
              "Mediator Pattern"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "The Template Method Pattern allows a class to defer its instantiation to subclasses, defining the skeleton of an algorithm."
      },
      {
          domain: "Software Engineering",
          text: "Which pattern allows for defining the skeleton of an algorithm in an operation while deferring some steps to client subclasses?",
          expected: ["template", "method", "pattern", "algorithm", "design"],
          options: [
              "Strategy Pattern",
              "Adapter Pattern",
              "Template Method Pattern",
              "Builder Pattern"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "The Template Method Pattern allows for defining the skeleton of an algorithm in an operation while deferring some steps to client subclasses."
      },
      {
          domain: "Software Engineering",
          text: "Which design pattern separates the construction of a complex object from its representation, allowing the same construction process to create different representations?",
          expected: ["builder", "construction", "pattern", "representation", "design"],
          options: [
              "Prototype Pattern",
              "Composite Pattern",
              "Builder Pattern",
              "Factory Method Pattern"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "The Builder Pattern separates the construction of a complex object from its representation, allowing for greater flexibility in the object-building process."
      },
      // Mock Questions - Data Science
      
        {
            domain: "Data Science",
            text: "What is the process of converting raw data into insightful information called?",
            expected: ["data", "analysis", "information", "insight"],
            options: [
                "Data Cleansing",
                "Data Visualization",
                "Data Analysis",
                "Data Mining"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Data Analysis is the process of converting raw data into insightful information, making data-driven decisions possible."
        },
        {
            domain: "Data Science",
            text: "Which statistical technique is commonly used for making predictions based on historical data?",
            expected: ["regression", "prediction", "historical", "data", "analysis"],
            options: [
                "Clustering",
                "Regression",
                "Classification",
                "Dimensionality Reduction"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "Regression is a statistical technique used for making predictions based on historical data, particularly helpful in forecasting."
        },
        {
            domain: "Data Science",
            text: "What is the primary purpose of exploratory data analysis (EDA)?",
            expected: ["explore", "data", "visualization", "insights"],
            options: [
                "To clean the data",
                "To create predictive models",
                "To explore data and extract insights",
                "To automate data processes"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "The primary purpose of exploratory data analysis (EDA) is to explore data and extract insights to inform further analysis."
        },
        {
            domain: "Data Science",
            text: "Which term describes the phenomenon when a model performs well on training data but poorly on unseen data?",
            expected: ["overfitting", "generalization", "training", "data"],
            options: [
                "Overfitting",
                "Underfitting",
                "Cross-validation",
                "Generalization"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Overfitting describes the phenomenon when a model performs well on training data but poorly on unseen data due to too much complexity."
        },
        {
            domain: "Data Science",
            text: "What is the purpose of data normalization?",
            expected: ["scale", "data", "features", "values"],
            options: [
                "To scale data for faster processing",
                "To reduce dimensionality",
                "To eliminate duplicates",
                "To prepare data for visualization"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "The purpose of data normalization is to scale data so that features have a similar range and can be compared effectively."
        },
        {
            domain: "Data Science",
            text: "Which algorithm is commonly used for clustering data points into distinct groups?",
            expected: ["K-means", "classification", "grouping", "cluster"],
            options: [
                "Linear Regression",
                "K-means",
                "Decision Trees",
                "Support Vector Machines"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "The K-means algorithm is commonly used for clustering data points into distinct groups based on their features."
        },
        {
            domain: "Data Science",
            text: "What does the term 'feature engineering' refer to?",
            expected: ["features", "creation", "data", "models"],
            options: [
                "Creating new features from existing data to improve model performance",
                "Selecting a feature subset for model training",
                "Normalizing feature values",
                "Visualizing features for better insights"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Feature engineering refers to creating new features from existing data to improve model performance and predictive accuracy."
        },
        {
            domain: "Data Science",
            text: "Which metric is commonly used to evaluate the performance of a classification model?",
            expected: ["accuracy", "metric", "evaluation", "performance"],
            options: [
                "Mean Absolute Error",
                "Accuracy",
                "Root Mean Squared Error",
                "R-squared"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "Accuracy is commonly used to evaluate the performance of a classification model, measuring the proportion of correct predictions."
        },
        {
            domain: "Data Science",
            text: "What is a confusion matrix used for?",
            expected: ["evaluation", "classification", "results", "performance"],
            options: [
                "To visualize model performance",
                "To measure variance",
                "To calculate correlation",
                "To reduce dimensionality"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A confusion matrix is used to visualize the performance of a classification model by displaying true vs. predicted classifications."
        },
        {
            domain: "Data Science",
            text: "What is the purpose of cross-validation in model training?",
            expected: ["validation", "training", "data", "model"],
            options: [
                "To reduce model complexity",
                "To identify overfitting",
                "To evaluate model performance on unseen data",
                "To select features"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Cross-validation is used to evaluate model performance on unseen data, providing a more reliable estimation of model effectiveness."
        },
        {
            domain: "Data Science",
            text: "Which technique is used to handle missing data in a dataset?",
            expected: ["imputation", "handling", "data", "missing"],
            options: [
                "Cleaning",
                "Imputation",
                "Normalization",
                "Feature Selection"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "Imputation is a technique used to handle missing data in a dataset by filling in gaps with estimated values."
        },
        {
            domain: "Data Science",
            text: "What is the purpose of a decision tree in data analysis?",
            expected: ["decision", "rules", "classification", "data"],
            options: [
                "To visualize the data flow",
                "To classify data points into categories using decision rules",
                "To find relationships between variables",
                "To perform linear regression"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "A decision tree is used to classify data points into categories using decision rules based on feature values."
        },
        {
            domain: "Data Science",
            text: "What does 'bias' refer to in machine learning?",
            expected: ["error", "estimate", "model", "differences"],
            options: [
                "The difference between the predicted values and the actual values",
                "The model's ability to generalize to new data",
                "The complexity of the model",
                "The selection of training data"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Bias refers to the difference between the predicted values and the actual values, impacting the model's accuracy."
        },
        {
            domain: "Data Science",
            text: "What is the purpose of regularization in a machine learning model?",
            expected: ["overfitting", "control", "complexity", "model"],
            options: [
                "To reduce training time",
                "To improve model interpretability",
                "To control model complexity and prevent overfitting",
                "To increase accuracy"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Regularization is used to control model complexity and prevent overfitting by adding a penalty for larger coefficients."
        },
        {
            domain: "Data Science",
            text: "Which library is commonly used for data manipulation and analysis in Python?",
            expected: ["pandas", "numpy", "scikit-learn", "matplotlib"],
            options: [
                "Pandas",
                "Numpy",
                "Scikit-learn",
                "Matplotlib"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Pandas is a popular library in Python used for data manipulation and analysis, providing data structures like DataFrames."
        },
        {
            domain: "Data Science",
            text: "What does 'ensemble learning' refer to in machine learning?",
            expected: ["models", "combination", "algorithms", "performance"],
            options: [
                "Using a single model for predictions",
                "Combining multiple models to improve performance",
                "Using heuristic approaches",
                "Data normalization"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "Ensemble learning refers to the technique of combining multiple models to improve predictive performance and robustness."
        },
        {
            domain: "Data Science",
            text: "Which method is used to visualize the relationship between two numerical variables?",
            expected: ["scatter", "plot", "visualization", "variables"],
            options: [
                "Line Plot",
                "Bar Chart",
                "Histogram",
                "Scatter Plot"
            ],
            correctOption: 3,
            isMockQuestion: true,
            answer: "A Scatter Plot is used to visualize the relationship between two numerical variables, helping to identify trends or correlations."
        },
        {
            domain: "Data Science",
            text: "What is the main objective of unsupervised learning?",
            expected: ["data", "patterns", "without", "labels"],
            options: [
                "To predict outcomes based on labeled data",
                "To discover patterns in unlabeled data",
                "To classify data points",
                "To regress data relationships"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "The main objective of unsupervised learning is to discover patterns in unlabeled data, allowing for clustering or association."
        },
        {
            domain: "Data Science",
            text: "What is the purpose of model evaluation metrics?",
            expected: ["evaluate", "performance", "model", "accurate"],
            options: [
                "To adjust model parameters",
                "To assess the model's accuracy and effectiveness",
                "To set up training data",
                "To predict future outcomes"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "Model evaluation metrics are used to assess the model's accuracy and effectiveness, ensuring that it meets performance criteria."
        },
        {
            domain: "Data Science",
            text: "Which method is effective for dimensionality reduction in large datasets?",
            expected: ["PCA", "dimensionality", "reduction", "analysis"],
            options: [
                "Feature Scaling",
                "PCA (Principal Component Analysis)",
                "Normalization",
                "Data Cleaning"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "PCA (Principal Component Analysis) is an effective method for dimensionality reduction in large datasets, helping to simplify models."
        },
        {
            domain: "Data Science",
            text: "What type of machine learning is focused on making predictions based on known outcomes?",
            expected: ["supervised", "learning", "predictions", "outcomes"],
            options: [
                "Supervised Learning",
                "Unsupervised Learning",
                "Reinforcement Learning",
                "Semi-supervised Learning"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Supervised Learning is focused on making predictions based on known outcomes, using labeled data to train models."
        },
        // Product Management
          {
              domain: "Product Management",
              text: "What is the primary role of a product manager?",
              expected: ["strategy", "customer", "product", "development"],
              options: [
                  "To manage the development team",
                  "To align the product vision with market needs",
                  "To oversee marketing campaigns",
                  "To control budget and expenses"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The primary role of a product manager is to align the product vision with market needs to ensure the product's success."
          },
          {
              domain: "Product Management",
              text: "What is a product roadmap used for?",
              expected: ["schedule", "development", "planning", "features"],
              options: [
                  "To list tasks for the development team",
                  "To provide a high-level view of product strategy and timeline",
                  "To track customer feedback",
                  "To estimate product costs"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "A product roadmap is used to provide a high-level view of product strategy and timeline, helping to communicate direction."
          },
          {
              domain: "Product Management",
              text: "Which framework is commonly used for prioritizing product features?",
              expected: ["RICE", "Kanban", "Scrum", "Lean"],
              options: [
                  "SWOT",
                  "RICE",
                  "OKR",
                  "Agile"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The RICE framework is commonly used for prioritizing product features based on Reach, Impact, Confidence, and Effort."
          },
          {
              domain: "Product Management",
              text: "What does MVP stand for in product management?",
              expected: ["minimum", "viable", "product", "development"],
              options: [
                  "Minimum Viable Product",
                  "Most Valuable Product",
                  "Managed Value Proposition",
                  "Maximal Viable Performance"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "MVP stands for Minimum Viable Product, which is the simplest version of a product that can be released to gather feedback."
          },
          {
              domain: "Product Management",
              text: "What is the purpose of user personas in product development?",
              expected: ["representation", "users", "needs", "design"],
              options: [
                  "To represent different types of users and their needs",
                  "To categorize product features",
                  "To map out user journeys",
                  "To identify competitive products"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "User personas are created to represent different types of users and their needs, helping to guide product design and features."
          },
          {
              domain: "Product Management",
              text: "Which method is used to gather direct feedback from users about a product?",
              expected: ["surveys", "feedback", "interviews", "testing"],
              options: [
                  "Focus Groups",
                  "Surveys",
                  "User Interviews",
                  "All of the Above"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "All of the Above methods—including focus groups, surveys, and user interviews—are used to gather direct feedback from users."
          },
          {
              domain: "Product Management",
              text: "What does the term 'product-market fit' refer to?",
              expected: ["market", "customer", "product", "demand"],
              options: [
                  "The level of competition in the market",
                  "When a product meets the demands of a specific market",
                  "The process of launching a product",
                  "The product's life cycle stage"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "Product-market fit refers to when a product meets the demands of a specific market and satisfies customer needs."
          },
          {
              domain: "Product Management",
              text: "Who is responsible for defining the product vision?",
              expected: ["product", "manager", "stakeholders", "team"],
              options: [
                  "Product Manager",
                  "Development Team",
                  "Marketing Team",
                  "Sales Team"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The Product Manager is responsible for defining the product vision and ensuring alignment with market needs."
          },
          {
              domain: "Product Management",
              text: "What is an important consideration while defining product pricing strategy?",
              expected: ["cost", "market", "competition", "value"],
              options: [
                  "Cost of production only",
                  "Value perceived by customers",
                  "Historical pricing data",
                  "Marketing expenses"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "An important consideration while defining product pricing strategy is the value perceived by customers, as it influences buying decisions."
          },
          {
              domain: "Product Management",
              text: "Which of the following is a key performance indicator (KPI) for product success?",
              expected: ["growth", "conversion", "metrics", "retention"],
              options: [
                  "User Acquisition Cost",
                  "Monthly Active Users",
                  "Customer Lifetime Value",
                  "All of the Above"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "All of the Above metrics—User Acquisition Cost, Monthly Active Users, and Customer Lifetime Value—are key performance indicators for product success."
          },
          {
              domain: "Product Management",
              text: "What does a product backlog contain?",
              expected: ["features", "tasks", "prioritized", "items"],
              options: [
                  "Completed tasks only",
                  "Prioritized list of product features and tasks",
                  "Marketing strategies",
                  "User feedback"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "A product backlog contains a prioritized list of product features, tasks, and requirements that are to be worked on."
          },
          {
              domain: "Product Management",
              text: "What is the purpose of conducting A/B testing?",
              expected: ["comparative", "analysis", "user", "experience"],
              options: [
                  "To compare different products",
                  "To analyze market trends",
                  "To compare two versions of a product feature",
                  "To define product requirements"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "The purpose of conducting A/B testing is to compare two versions of a product feature to determine which one performs better."
          },
          {
              domain: "Product Management",
              text: "What does 'skateboarding' refer to in product management?",
              expected: ["minimum", "product", "viable", "version"],
              options: [
                  "Rushing a product to market",
                  "Creating a simplified version of a product",
                  "Prioritizing features based on user demand",
                  "Maximizing product performance"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "In product management, 'skateboarding' refers to creating a simplified version of a product to test market interest quickly."
          },
          {
              domain: "Product Management",
              text: "What is the importance of stakeholder management in product development?",
              expected: ["communication", "alignment", "requirements", "expectations"],
              options: [
                  "To ensure project timelines",
                  "To align the product vision with stakeholder expectations",
                  "To speed up development",
                  "To lessen marketing efforts"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "Stakeholder management is crucial for aligning the product vision with stakeholder expectations and ensuring smooth communication."
          },
          {
              domain: "Product Management",
              text: "Which of the following is a common agile methodology used in product management?",
              expected: ["Scrum", "Waterfall", "Lean", "Six Sigma"],
              options: [
                  "Scrum",
                  "Waterfall",
                  "Critical Path",
                  "Gantt Charts"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Scrum is a common agile methodology used in product management for iterative development and flexibility in responding to change."
          },
          {
              domain: "Product Management",
              text: "What is a key activity during the product discovery phase?",
              expected: ["validation", "prototype", "testing", "maintenance"],
              options: [
                  "Feature implementation",
                  "Cost estimation",
                  "User validation and feedback collection",
                  "Market promotion"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "User validation and feedback collection are key activities during the product discovery phase to ensure that needs are met."
          },
          {
              domain: "Product Management",
              text: "What is Continuous Integration in software product development?",
              expected: ["integration", "code", "automation", "testing"],
              options: [
                  "Automating the testing of code changes",
                  "Regularly integrating code changes into a shared repository",
                  "Frequent releases to customers",
                  "Collecting user feedback continuously"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "Continuous Integration in software product development refers to regularly integrating code changes into a shared repository."
          },
          {
              domain: "Product Management",
              text: "What is meant by 'pivoting' in product management?",
              expected: ["change", "product", "strategy", "direction"],
              options: [
                  "Making minor adjustments to the product",
                  "Completely changing the product model or strategy",
                  "Focusing on marketing instead of product innovation",
                  "Continuing with the original plan regardless of feedback"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "Pivoting in product management refers to completely changing the product model or strategy in response to feedback and learning."
          },
          {
              domain: "Product Management",
              text: "What technique helps in prioritizing product features based on their value and cost?",
              expected: ["cost-benefit", "analysis", "feature", "prioritization"],
              options: [
                  "Weighted Scoring",
                  "Moscow Method",
                  "Cost-Benefit Analysis",
                  "Impact Mapping"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "Cost-Benefit Analysis helps in prioritizing product features based on their value and cost, guiding decision-making."
          },
          {
              domain: "Product Management",
              text: "Which metric helps in tracking user engagement with a product?",
              expected: ["DAU", "engagement", "active", "usage"],
              options: [
                  "Daily Active Users (DAU)",
                  "Monthly Revenue",
                  "Customer Satisfaction Score (CSAT)",
                  "Average Session Length"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Daily Active Users (DAU) is a metric that helps track user engagement with a product over a daily timeframe."
          },
          //cloud computing
            {
                domain: "Cloud Computing",
                text: "What is cloud computing primarily used for?",
                expected: ["storage", "services", "internet", "on-demand"],
                options: [
                    "Data storage and processing",
                    "Local data management",
                    "Traditional software applications",
                    "Network administration"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "Cloud computing is primarily used for data storage and processing, offering scalable and on-demand resources via the internet."
            },
            {
                domain: "Cloud Computing",
                text: "Which cloud service model provides virtualized computing resources over the internet?",
                expected: ["IaaS", "service", "resources", "infrastructure"],
                options: [
                    "SaaS",
                    "PaaS",
                    "IaaS",
                    "DaaS"
                ],
                correctOption: 2,
                isMockQuestion: true,
                answer: "IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet, enabling users to rent hardware."
            },
            {
                domain: "Cloud Computing",
                text: "What does SaaS stand for?",
                expected: ["software", "service", "access", "application"],
                options: [
                    "Software as a Service",
                    "System as a Service",
                    "Storage as a Service",
                    "Server as a Service"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "SaaS stands for Software as a Service, offering software applications over the internet on a subscription basis."
            },
            {
                domain: "Cloud Computing",
                text: "Which of the following is an example of a PaaS solution?",
                expected: ["Heroku", "Dropbox", "Salesforce", "Google Docs"],
                options: [
                    "Heroku",
                    "Microsoft Office 365",
                    "Zoom",
                    "Amazon S3"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "Heroku is an example of a PaaS (Platform as a Service) solution, providing a platform for developers to build and deploy applications."
            },
            {
                domain: "Cloud Computing",
                text: "What is the primary benefit of using cloud computing?",
                expected: ["cost", "scalability", "efficiency", "flexibility"],
                options: [
                    "Reduced hardware investment",
                    "Scalability and on-demand resources",
                    "Automatic software updates",
                    "Increased manual intervention"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "The primary benefit of using cloud computing is scalability and on-demand resources, allowing businesses to adjust resources as needed."
            },
            {
                domain: "Cloud Computing",
                text: "Which deployment model is used when resources are exclusively used by a single organization?",
                expected: ["private", "public", "hybrid", "community"],
                options: [
                    "Public Cloud",
                    "Private Cloud",
                    "Hybrid Cloud",
                    "Multi-Cloud"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "A Private Cloud deployment model is used when resources are exclusively used by a single organization."
            },
            {
                domain: "Cloud Computing",
                text: "What is the purpose of cloud security?",
                expected: ["protection", "data", "resources", "privacy"],
                options: [
                    "To monitor user activity",
                    "To protect data and applications hosted in the cloud",
                    "To manage cloud costs",
                    "To increase resource performance"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "The purpose of cloud security is to protect data and applications hosted in the cloud from unauthorized access and other cyber threats."
            },
            {
                domain: "Cloud Computing",
                text: "Which term describes the method of distributing resources across multiple cloud providers?",
                expected: ["multi-cloud", "distribution", "management", "resource"],
                options: [
                    "Single Cloud",
                    "Multi-Cloud",
                    "Hybrid Cloud",
                    "Public Cloud"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "Multi-Cloud describes the method of distributing resources and services across multiple cloud providers to avoid vendor lock-in and enhance resilience."
            },
            {
                domain: "Cloud Computing",
                text: "What is the primary function of a cloud load balancer?",
                expected: ["distribution", "traffic", "management", "health"],
                options: [
                    "To distribute incoming traffic across multiple servers",
                    "To store data securely",
                    "To monitor application performance",
                    "To provide backup services"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "The primary function of a cloud load balancer is to distribute incoming traffic across multiple servers to ensure optimal performance and availability."
            },
            {
                domain: "Cloud Computing",
                text: "What is a key characteristic of serverless computing?",
                expected: ["management", "infrastructure", "scalability", "provisioning"],
                options: [
                    "Users must manage the infrastructure",
                    "Automatic scaling and provisioning based on demand",
                    "High costs for idle resources",
                    "Complex deployment processes"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "A key characteristic of serverless computing is automatic scaling and provisioning based on demand, allowing developers to focus on code without managing infrastructure."
            },
            {
                domain: "Cloud Computing",
                text: "Which cloud service model is best suited for developers building applications?",
                expected: ["PaaS", "IaaS", "SaaS", "DaaS"],
                options: [
                    "PaaS",
                    "SaaS",
                    "IaaS",
                    "CaaS"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "PaaS (Platform as a Service) is best suited for developers building applications, providing a platform with tools and services for development."
            },
            {
                domain: "Cloud Computing",
                text: "Which of the following is NOT a benefit of cloud computing?",
                expected: ["local", "access", "cost", "scalability"],
                options: [
                    "Cost-effectiveness",
                    "Accessibility from anywhere",
                    "Local data processing",
                    "Scalability of resources"
                ],
                correctOption: 2,
                isMockQuestion: true,
                answer: "Local data processing is NOT a benefit of cloud computing, as it relies on processing resources in the cloud rather than on-premises."
            },
            {
                domain: "Cloud Computing",
                text: "What is the purpose of virtualization in cloud computing?",
                expected: ["resource", "abstraction", "multiple", "servers"],
                options: [
                    "To combine multiple physical servers into one",
                    "To run applications without an operating system",
                    "To abstract hardware resources and create virtual instances",
                    "To increase workload on physical servers"
                ],
                correctOption: 2,
                isMockQuestion: true,
                answer: "The purpose of virtualization in cloud computing is to abstract hardware resources and create virtual instances, improving resource utilization."
            },
            {
                domain: "Cloud Computing",
                text: "What does the term 'data sovereignty' refer to?",
                expected: ["data", "regulations", "ownership", "location"],
                options: [
                    "Data ownership by cloud service providers",
                    "Regulations that govern data based on its location",
                    "Data encryption practices",
                    "Data backup solutions"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "Data sovereignty refers to regulations that govern data based on its location, affecting how data can be stored and processed."
            },
            {
                domain: "Cloud Computing",
                text: "Which of the following is a public cloud service provider?",
                expected: ["AWS", "private", "local", "on-premises"],
                options: [
                    "AWS (Amazon Web Services)",
                    "IBM on-premises solutions",
                    "Azure Stack",
                    "A private data center"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "AWS (Amazon Web Services) is a public cloud service provider offering a wide range of cloud services accessible to all users."
            },
            {
                domain: "Cloud Computing",
                text: "What is the term for the practice of using both private and public cloud services together?",
                expected: ["hybrid", "multi-cloud", "scalability", "integration"],
                options: [
                    "Hybrid Cloud",
                    "Monolithic Cloud",
                    "Private Cloud",
                    "Public Cloud"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "Hybrid Cloud refers to the practice of using both private and public cloud services together, allowing for greater flexibility."
            },
            {
                domain: "Cloud Computing",
                text: "What is the purpose of a cloud service agreement (CSA)?",
                expected: ["terms", "conditions", "provider", "services"],
                options: [
                    "To define the terms and conditions of service between provider and customer",
                    "To establish the pricing for cloud services",
                    "To outline feature functionalities",
                    "To specify the cloud infrastructure"
                ],
                correctOption: 0,
                isMockQuestion: true,
                answer: "The purpose of a cloud service agreement (CSA) is to define the terms and conditions of service between the cloud provider and the customer."
            },
            {
                domain: "Cloud Computing",
                text: "In cloud computing, what is a 'region'?",
                expected: ["geographic", "data", "location", "services"],
                options: [
                    "A specific type of deployment model",
                    "A geographic area consisting of multiple data centers",
                    "A service level agreement",
                    "A performance metric"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "In cloud computing, a 'region' refers to a geographic area consisting of multiple data centers that provide services."
            },
            {
                domain: "Cloud Computing",
                text: "What defines a 'service level agreement' (SLA) in cloud services?",
                expected: ["guarantees", "performance", "requirements", "services"],
                options: [
                    "The types of services offered by the provider",
                    "Legal terms and conditions",
                    "The guarantees regarding the service's performance and availability",
                    "The pricing structure for services"
                ],
                correctOption: 2,
                isMockQuestion: true,
                answer: "A service level agreement (SLA) defines the guarantees regarding the service's performance and availability, outlining expected service levels."
            },
            {
                domain: "Cloud Computing",
                text: "What role do APIs play in cloud computing?",
                expected: ["interfaces", "communication", "services", "integration"],
                options: [
                    "APIs enforce user authentication",
                    "APIs provide interfaces for communication between services",
                    "APIs replace cloud storage",
                    "APIs limit access to cloud resources"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "APIs play a key role in cloud computing by providing interfaces for communication between services, enabling integration and functionality."
            },
            {
                domain: "Cloud Computing",
                text: "What does 'disaster recovery' refer to in a cloud context?",
                expected: ["backup", "system", "restoration", "recovery"],
                options: [
                    "The process of securing data against loss",
                    "A strategy to recover data and applications after a disaster",
                    "Routine maintenance of cloud systems",
                    "Data migration between clouds"
                ],
                correctOption: 1,
                isMockQuestion: true,
                answer: "In a cloud context, 'disaster recovery' refers to a strategy to recover data and applications after a disaster, ensuring business continuity."
            },
            //Marketing
            {
              domain: "Marketing",
              text: "What does 'SEO' stand for?",
              expected: ["search", "engine", "optimization", "visibility"],
              options: [
                  "Search Engine Optimization",
                  "Social Engagement Outcome",
                  "Search Enhanced Output",
                  "Systematic Engagement Optimization"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "SEO stands for Search Engine Optimization, which is the practice of improving the visibility of a website in search engines."
          },
          {
              domain: "Marketing",
              text: "What is the goal of content marketing?",
              expected: ["engagement", "valuable", "audience", "sharing"],
              options: [
                  "To create valuable content that attracts and retains an audience",
                  "To boost product sales immediately",
                  "To improve customer service",
                  "To enhance social media presence"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The goal of content marketing is to create valuable content that attracts and retains an audience."
          },
          {
              domain: "Marketing",
              text: "What is market segmentation?",
              expected: ["divide", "market", "target", "strategy"],
              options: [
                  "The process of dividing a market into distinct groups of buyers",
                  "Developing a pricing strategy",
                  "Creating product features",
                  "Enhancing product quality"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Market segmentation is the process of dividing a market into distinct groups of buyers with different needs and characteristics."
          },
          {
              domain: "Marketing",
              text: "What is a unique selling proposition (USP)?",
              expected: ["unique", "differentiation", "advantage", "product"],
              options: [
                  "A statement that highlights the unique benefits of a product compared to competitors",
                  "A marketing budget",
                  "A sales target",
                  "A distribution channel strategy"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A unique selling proposition (USP) emphasizes the unique benefits of a product that distinguish it from competitors."
          },
          {
              domain: "Marketing",
              text: "What is the purpose of a marketing funnel?",
              expected: ["conversion", "customer", "journey", "engagement"],
              options: [
                  "To visualize the customer journey from awareness to purchase",
                  "To analyze financial performance",
                  "To determine budget allocation",
                  "To measure employee performance"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The marketing funnel visualizes the journey a customer takes from awareness to conversion."
          },
          {
              domain: "Marketing",
              text: "What is 'email marketing'?",
              expected: ["direct", "communication", "promotion", "audience"],
              options: [
                  "A strategy that involves sending emails to prospects and customers to promote products or services",
                  "Sending mass emails without personalization",
                  "A method of advertising on social media",
                  "Text messaging customers about new products"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Email marketing involves sending targeted emails to prospects and customers to promote products or services."
          },
          {
              domain: "Marketing",
              text: "What does 'PPC' stand for?",
              expected: ["pay", "click", "advertising", "model"],
              options: [
                  "Pay-Per-Click",
                  "Pay-Per-Customer",
                  "Public-Per-Click",
                  "Pay-Per-Conversion"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "PPC stands for Pay-Per-Click, an online advertising model where advertisers pay each time a user clicks on their ad."
          },
          {
              domain: "Marketing",
              text: "What is brand loyalty?",
              expected: ["consumer", "preference", "repeat", "trust"],
              options: [
                  "The tendency of consumers to continue buying the same brand over time",
                  "The price discount offered to regular customers",
                  "The variety of products a brand offers",
                  "The percentage of market share held by a brand"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Brand loyalty refers to the tendency of consumers to consistently purchase the same brand's products due to trust and preference."
          },
          {
              domain: "Marketing",
              text: "What does 'A/B testing' involve?",
              expected: ["comparison", "versions", "performance", "metrics"],
              options: [
                  "Comparing two versions of a webpage or advertisement to determine which performs better",
                  "Analyzing sales data from different channels",
                  "Testing customer service approaches",
                  "Conducting focus groups for product feedback"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A/B testing involves comparing two versions of a webpage or ad to determine which one performs better based on specific metrics."
          },
          {
              domain: "Marketing",
              text: "What is social media marketing?",
              expected: ["promotion", "platforms", "engagement", "content"],
              options: [
                  "Using social media platforms to promote products and engage with customers",
                  "Advertising in newspapers and magazines",
                  "Creating websites for brands",
                  "Conducting telephone surveys"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Social media marketing involves using social media platforms to promote products and engage directly with customers."
          },
          {
              domain: "Marketing",
              text: "What is the purpose of market research?",
              expected: ["insights", "data", "consumer", "trends"],
              options: [
                  "To gather and analyze data about consumers and market trends",
                  "To provide customer service",
                  "To create advertisements",
                  "To calculate sales forecasts"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Market research aims to gather and analyze data about consumers and market trends to inform strategic decisions."
          },
          {
              domain: "Marketing",
              text: "What is viral marketing?",
              expected: ["sharing", "content", "spread", "audience"],
              options: [
                  "A marketing strategy that encourages users to share content, organically spreading brand awareness",
                  "A method of direct mail advertising",
                  "A technique for reducing marketing costs",
                  "A type of product placement"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Viral marketing is a strategy that encourages users to share marketing content, helping to spread brand awareness organically."
          },
          {
              domain: "Marketing",
              text: "What does 'customer persona' represent?",
              expected: ["representation", "target", "characteristics", "demographics"],
              options: [
                  "A detailed representation of a target customer including demographics and behaviors",
                  "A type of branding strategy",
                  "A marketing budget allocation",
                  "A method of calculating sales projections"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A customer persona is a detailed representation of a target customer, including demographics, behaviors, and needs."
          },
          {
              domain: "Marketing",
              text: "What is the role of a marketing strategy?",
              expected: ["plan", "approach", "objectives", "competitive"],
              options: [
                  "To outline the approach to reaching specific market objectives",
                  "To determine the production process",
                  "To manage distribution logistics",
                  "To increase employee productivity"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A marketing strategy outlines how a business will reach its target audience and achieve specific marketing objectives."
          },
          {
              domain: "Marketing",
              text: "What is brand equity?",
              expected: ["value", "brand", "perception", "loyalty"],
              options: [
                  "The value added to a product by having a recognizable brand name",
                  "The total sales revenue of a brand",
                  "The number of products a brand offers",
                  "The pricing strategy of a brand"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Brand equity is the value added to a product or service by having a well-known brand name, influencing consumer choice."
          },
          {
              domain: "Marketing",
              text: "What is the conversion rate?",
              expected: ["performance", "action", "defined", "measured"],
              options: [
                  "The percentage of users who take a desired action, such as making a purchase",
                  "The total number of visitors to a website",
                  "A measure of customer satisfaction",
                  "The total sales for a given period"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The conversion rate is the percentage of visitors who take a specific action, such as making a purchase."
          },
          {
              domain: "Marketing",
              text: "What does CRM stand for?",
              expected: ["customer", "relationship", "management", "strategy"],
              options: [
                  "Customer Relationship Management",
                  "Customer Return Model",
                  "Client Resource Management",
                  "Customer Revenue Model"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "CRM stands for Customer Relationship Management, a strategy for managing a company's relationships with its customers."
          },
          {
              domain: "Marketing",
              text: "What is the goal of a brand ambassador?",
              expected: ["ambassador", "advocacy", "brand", "promotion"],
              options: [
                  "To promote a brand or product through personal enthusiasm and genuine affinity",
                  "To manage customer complaints",
                  "To conduct market research",
                  "To analyze competitor performance"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A brand ambassador promotes a brand or product, advocating for it through personal enthusiasm and genuine support."
          },
          {
              domain: "Marketing",
              text: "What is 'influencer marketing'?",
              expected: ["collaboration", "promotion", "social", "figures"],
              options: [
                  "Collaborating with influential people to promote a brand or product",
                  "A technique for traditional media advertising",
                  "Using solely celebrity endorsements",
                  "Engaging customers through direct mail"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Influencer marketing is the practice of collaborating with influential figures to promote a brand or product."
          },
          {
              domain: "Marketing",
              text: "What is a tagline?",
              expected: ["slogan", "catchy", "brand", "message"],
              options: [
                  "A memorable phrase that captures the essence of a brand or product",
                  "A product description",
                  "An advertising technique",
                  "A type of market research"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "A tagline is a catchy phrase that encapsulates the main message or mission of a brand or product."
          },
          {
              domain: "Marketing",
              text: "What does 'brand positioning' entail?",
              expected: ["perception", "consumer", "differentiation", "market"],
              options: [
                  "Establishing a distinctive image of a brand in the minds of consumers relative to competitors",
                  "Creating a visual style for advertising",
                  "Determining product pricing",
                  "Choosing distribution channels"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "Brand positioning involves establishing a distinctive image of a brand in the minds of consumers relative to competitors."
          },
        //frontend development
        
          {
              domain: "Frontend Development",
              text: "What is the primary language used for creating web pages?",
              expected: ["html", "markup", "elements", "structure"],
              options: [
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "PHP"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "HTML (Hypertext Markup Language) is the primary language used for creating the structure and content of web pages."
          },
          {
              domain: "Frontend Development",
              text: "What does CSS stand for?",
              expected: ["cascading", "style", "sheets", "design"],
              options: [
                  "Cascading Style Sheets",
                  "Creative Style Syntax",
                  "Cascading Style Syntax",
                  "Color Style Sheets"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "CSS stands for Cascading Style Sheets, which is used for styling and layout of web pages."
          },
          {
              domain: "Frontend Development",
              text: "Which HTML tag is used to create a hyperlink?",
              expected: ["a", "link", "url", "href"],
              options: [
                  "<link>",
                  "<a>",
                  "<hyperlink>",
                  "<url>"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The <a> tag is used to create a hyperlink in HTML, allowing users to navigate to other pages or resources."
          },
          {
              domain: "Frontend Development",
              text: "What is the function of the <div> element in HTML?",
              expected: ["section", "block", "division", "content"],
              options: [
                  "To create a list",
                  "To define a division or section in an HTML document",
                  "To define a header",
                  "To create a table"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "<div> is used in HTML to define a division or section in a document, often used for layout purposes."
          },
          {
              domain: "Frontend Development",
              text: "Which property is used in CSS to change the text color?",
              expected: ["color", "text-color", "font-color", "background-color"],
              options: [
                  "text-color",
                  "color",
                  "font-color",
                  "text-decoration"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The 'color' property is used in CSS to change the text color of elements on a web page."
          },
          {
              domain: "Frontend Development",
              text: "What is the purpose of JavaScript in web development?",
              expected: ["interactivity", "design", "layout", "markup"],
              options: [
                  "To handle HTTP requests",
                  "To style web pages",
                  "To add interactivity and dynamic content",
                  "To define the structure of documents"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "JavaScript is used in web development to add interactivity and dynamic content to web pages."
          },
          {
              domain: "Frontend Development",
              text: "Which CSS framework is commonly used for creating responsive web designs?",
              expected: ["bootstrap", "foundation", "bulma", "all"],
              options: [
                  "Bootstrap",
                  "UIKit",
                  "Tailwind CSS",
                  "All of the Above"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "All of the Above frameworks—Bootstrap, UIKit, and Tailwind CSS—are commonly used for creating responsive web designs."
          },
          {
              domain: "Frontend Development",
              text: "What does responsive web design aim to achieve?",
              expected: ["adaptability", "layout", "device", "flexibility"],
              options: [
                  "Different layouts for different browsers",
                  "Fixed layout for mobile devices",
                  "Flexibility to adapt to various screen sizes and devices",
                  "Strict design rules for desktop screens"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "Responsive web design aims to achieve flexibility, adapting content to various screen sizes and devices for optimal viewing."
          },
          {
              domain: "Frontend Development",
              text: "Which of the following is a JavaScript library for building user interfaces?",
              expected: ["react", "node", "angular", "vue"],
              options: [
                  "jQuery",
                  "React",
                  "Node.js",
                  "Django"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "React is a JavaScript library designed for building user interfaces, particularly for single-page applications."
          },
          {
              domain: "Frontend Development",
              text: "What is the purpose of the <!DOCTYPE html> declaration?",
              expected: ["document", "type", "html5", "definition"],
              options: [
                  "To specify the character set used",
                  "To define the HTML version being used",
                  "To declare the document type and version of HTML",
                  "To enable JavaScript in the document"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "The <!DOCTYPE html> declaration is used to declare the document type and version of HTML being used, ensuring proper rendering."
          },
          {
              domain: "Frontend Development",
              text: "Which attribute is used to specify an image source in HTML?",
              expected: ["src", "source", "href", "img"],
              options: [
                  "src",
                  "source",
                  "link",
                  "img"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The 'src' attribute is used to specify the source of an image in an <img> tag in HTML."
          },
          {
              domain: "Frontend Development",
              text: "Which CSS property controls the spacing between the content and the border of an element?",
              expected: ["padding", "margin", "border-spacing", "spacing"],
              options: [
                  "margin",
                  "padding",
                  "border-spacing",
                  "content-spacing"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The 'padding' property controls the spacing between the content and the border of an element in CSS."
          },
          {
              domain: "Frontend Development",
              text: "What is the purpose of the 'alt' attribute in an <img> tag?",
              expected: ["alternative", "image", "text", "description"],
              options: [
                  "To provide additional information about the image",
                  "To display alternative text when the image fails to load",
                  "To define the image resolution",
                  "To specify the image file type"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The 'alt' attribute in an <img> tag provides alternative text that displays when the image fails to load."
          },
          {
              domain: "Frontend Development",
              text: "Which JavaScript method is used to select an HTML element by its ID?",
              expected: ["getElementById", "querySelector", "getElementsByClassName", "selectElement"],
              options: [
                  "getElementById()",
                  "querySelector()",
                  "getElementsByClassName()",
                  "selectElement()"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The 'getElementById()' method is used to select an HTML element by its ID in JavaScript."
          },
          {
              domain: "Frontend Development",
              text: "What is the main benefit of using CSS preprocessors like SASS or LESS?",
              expected: ["variables", "mixins", "modularity", "all"],
              options: [
                  "Easier nesting of styles",
                  "Support for variables and mixins",
                  "Better organization and modularity of styles",
                  "All of the Above"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "The main benefit of using CSS preprocessors like SASS or LESS includes support for variables, mixins, and better organization of styles."
          },
          {
              domain: "Frontend Development",
              text: "What does the 'display: none;' CSS property do?",
              expected: ["visibility", "hide", "element", "rendering"],
              options: [
                  "Hides the element but still takes up space",
                  "Removes the element from the document flow entirely",
                  "Makes the element transparent",
                  "Displays the element as a block"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The 'display: none;' CSS property removes the element from the document flow entirely, making it neither visible nor occupying space."
          },
          {
              domain: "Frontend Development",
              text: "What do you call the process of optimizing a web page for better performance and speed?",
              expected: ["optimization", "performance", "loading", "enhancement"],
              options: [
                  "Caching",
                  "Minification",
                  "Performance Optimization",
                  "All of the Above"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "The process of optimizing a web page for better performance and speed is known as Performance Optimization, which often includes caching and minification."
          },
          {
              domain: "Frontend Development",
              text: "Which HTML5 feature allows for audio and video playback on web pages?",
              expected: ["media", "tag", "audio", "video"],
              options: [
                  "<media>",
                  "<audio>",
                  "<video>",
                  "<embed>"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The <audio> and <video> tags in HTML5 enable audio and video playback, providing built-in support for media content."
          },
          {
              domain: "Frontend Development",
              text: "What is the main purpose of using JavaScript frameworks like Angular or Vue?",
              expected: ["structure", "faster", "tools", "coding"],
              options: [
                  "To enhance HTML functionality",
                  "To speed up the development process and provide structure",
                  "To create static web pages",
                  "To replace CSS styling"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "JavaScript frameworks like Angular or Vue are used to speed up the development process and provide structure for building dynamic web applications."
          },
          {
              domain: "Frontend Development",
              text: "What does 'viewport' refer to in web design?",
              expected: ["visible", "area", "browser", "size"],
              options: [
                  "The visible area of a web page within a browser",
                  "The size of the entire web page",
                  "A specific section of a document",
                  "The rendering engine of the browser"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "The 'viewport' refers to the visible area of a web page within a browser where content can be displayed."
          },
          //database management
          {
            domain: "Database Management",
            text: "What is a database?",
            expected: ["collection", "data", "structured", "information"],
            options: [
                "A structured collection of data stored electronically",
                "A type of software application",
                "A hardware component",
                "A programming language"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A database is a structured collection of data stored electronically in a computer system."
        },
        {
            domain: "Database Management",
            text: "What does SQL stand for?",
            expected: ["structured", "query", "language", "database"],
            options: [
                "Structured Query Language",
                "Standard Query Language",
                "Simple Query Language",
                "Sequential Query Language"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "SQL stands for Structured Query Language, which is used for managing and manipulating databases."
        },
        {
            domain: "Database Management",
            text: "What is a primary key?",
            expected: ["unique", "identifier", "record", "table"],
            options: [
                "A unique identifier for a record in a database table",
                "A reference key for foreign keys",
                "A type of index",
                "A query optimization technique"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A primary key is a unique identifier for a record in a database table, ensuring each record can be uniquely identified."
        },
        {
            domain: "Database Management",
            text: "What is normalization?",
            expected: ["data", "organization", "structure", "redundancy"],
            options: [
                "The process of organizing data to minimize redundancy and improve data integrity",
                "A method for indexing data",
                "A technique for data encryption",
                "The process of backing up data"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Normalization is the process of organizing data to minimize redundancy and improve data integrity within a database."
        },
        {
            domain: "Database Management",
            text: "What does a foreign key do?",
            expected: ["link", "tables", "relationship", "data"],
            options: [
                "Links one table to another in a relational database",
                "Represents the primary key of a table",
                "Indexes a table for faster queries",
                "Defines the structure of a database"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A foreign key links one table to another in a relational database, establishing a relationship between the two."
        },
        {
            domain: "Database Management",
            text: "What is an index in a database?",
            expected: ["performance", "search", "efficiency", "data"],
            options: [
                "A data structure that improves the speed of data retrieval operations on a database table",
                "A backup of the database",
                "A type of data validation",
                "A storage method for large data sets"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "An index is a data structure that improves the speed of data retrieval operations on a database table."
        },
        {
            domain: "Database Management",
            text: "What does ACID stand for in database management?",
            expected: ["atomicity", "consistency", "isolation", "durability"],
            options: [
                "Atomicity, Consistency, Isolation, Durability",
                "Aggregation, Consistency, Integrity, Durability",
                "Atomicity, Control, Isolation, Data",
                "Access, Control, Isolation, Durability"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "ACID stands for Atomicity, Consistency, Isolation, and Durability, which are essential properties of a transaction."
        },
        {
            domain: "Database Management",
            text: "What is a query in the context of databases?",
            expected: ["request", "data", "information", "retrieve"],
            options: [
                "A request for data or information from a database",
                "A type of database structure",
                "An operation for storing data",
                "A method of indexing"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A query is a request for data or information from a database, typically written in SQL."
        },
        {
            domain: "Database Management",
            text: "What is a data warehouse?",
            expected: ["storage", "analytical", "data", "business"],
            options: [
                "A centralized repository for storing and managing large volumes of historical data for analysis",
                "A type of backup system",
                "An OLTP database",
                "A retention policy for data"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A data warehouse is a centralized repository for storing and managing large volumes of historical data for analytical purposes."
        },
        {
            domain: "Database Management",
            text: "What is the difference between SQL and NoSQL databases?",
            expected: ["structured", "unstructured", "data", "flexibility"],
            options: [
                "SQL databases are structured and use fixed schemas; NoSQL databases are unstructured and more flexible",
                "SQL is faster; NoSQL is slower",
                "SQL supports only text data; NoSQL supports all data types",
                "NoSQL databases are newer and cannot handle large volumes of data"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "SQL databases are structured and use fixed schemas, while NoSQL databases are unstructured and more flexible."
        },
        {
            domain: "Database Management",
            text: "What is a stored procedure?",
            expected: ["predefined", "commands", "database", "execution"],
            options: [
                "A set of SQL commands that can be stored and executed on a database server",
                "A method for data encryption",
                "A backup process for data",
                "A type of database index"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A stored procedure is a set of SQL commands that are stored and executed on the database server."
        },
        {
            domain: "Database Management",
            text: "What does 'datatype' define?",
            expected: ["type", "values", "data", "field"],
            options: [
                "The kind of data that can be stored in a field, such as integer, varchar, or date",
                "The size of the data",
                "The method of indexing data",
                "The level of access to the data"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A datatype defines the kind of data that can be stored in a field, such as integer, varchar, or date."
        },
        {
            domain: "Database Management",
            text: "What is database mirroring?",
            expected: ["redundancy", "replication", "data", "availability"],
            options: [
                "A technique for creating a real-time copy of a database for redundancy and high availability",
                "A backup method for data",
                "A way to partition data",
                "A technique for data encryption"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Database mirroring is a technique for creating a real-time copy of a database for redundancy and high availability."
        },
        {
            domain: "Database Management",
            text: "What is a database schema?",
            expected: ["structure", "organization", "database", "elements"],
            options: [
                "The formal structure that defines how data is organized within a database",
                "A type of SQL command",
                "A backup format",
                "A method for data analysis"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A database schema is the formal structure that defines how data is organized within a database system."
        },
        {
            domain: "Database Management",
            text: "What is data redundancy?",
            expected: ["duplicate", "storage", "inefficiency", "issues"],
            options: [
                "The unnecessary duplication of data in a database, leading to potential inconsistency and inefficiency",
                "The process of archiving data",
                "An indexing method",
                "A backup strategy"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Data redundancy refers to the unnecessary duplication of data in a database, which can lead to inconsistency and inefficiency."
        },
        {
            domain: "Database Management",
            text: "What is a transaction in a database?",
            expected: ["series", "operations", "database", "success"],
            options: [
                "A series of operations performed as a single logical unit of work",
                "A method for data backup",
                "A type of data encryption",
                "An index structure"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A transaction is a series of operations that are treated as a single logical unit of work in a database."
        },
        {
            domain: "Database Management",
            text: "What are triggers in a database?",
            expected: ["automatic", "actions", "events", "conditions"],
            options: [
                "Automatic actions executed in response to certain events on a table or view",
                "Backup procedures for data",
                "Indexes for improving performance",
                "Stored procedures for data manipulation"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Triggers are automatic actions executed in response to certain events on a table or view within a database."
        },
        {
            domain: "Database Management",
            text: "What is a view in a database?",
            expected: ["virtual", "table", "selection", "data"],
            options: [
                "A virtual table based on the result of a SELECT query",
                "A physical table stored in the database",
                "A method for data backup",
                "A type of stored procedure"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A view in a database is a virtual table that is based on the result of a SELECT query."
        },
        {
            domain: "Database Management",
            text: "What is sharding?",
            expected: ["database", "partitioning", "scalability", "performance"],
            options: [
                "The process of horizontally partitioning a database into smaller, more manageable pieces called shards",
                "A method for data replication",
                "A way to enhance data security",
                "A technique to improve data backup"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Sharding is the process of horizontally partitioning a database into smaller pieces called shards for improved scalability."
        },
        {
            domain: "Database Management",
            text: "What is the purpose of data mining?",
            expected: ["analysis", "patterns", "large", "database"],
            options: [
                "To analyze large datasets to discover patterns, correlations, and insights",
                "To backup data",
                "To create databases",
                "To monitor system performance"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Data mining involves analyzing large datasets to discover patterns, correlations, and insights."
        },
        {
            domain: "Database Management",
            text: "What is multi-tenancy in databases?",
            expected: ["shared", "resources", "database", "architecture"],
            options: [
                "An architecture where a single database instance serves multiple tenants with isolated data",
                "A backup strategy for data",
                "A method for data encryption",
                "A type of indexing"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Multi-tenancy is an architecture where a single database instance serves multiple tenants, each with isolated data."
        },
        //Network Engineering 
        
          {
              domain: "Network Engineering",
              text: "What is the primary function of a router in a network?",
              expected: ["routing", "traffic", "data", "connections"],
              options: [
                  "To connect devices in the same network",
                  "To filter and forward packets between networks",
                  "To provide network security",
                  "To increase bandwidth"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The primary function of a router is to filter and forward packets between networks, determining the best path for data."
          },
          {
              domain: "Network Engineering",
              text: "Which protocol is used for securely accessing network devices over an unsecured network?",
              expected: ["ssh", "telnet", "http", "ftp"],
              options: [
                  "Telnet",
                  "RDP",
                  "SSH",
                  "SNMP"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "SSH (Secure Shell) is used for securely accessing network devices over an unsecured network, encrypting the data transmitted."
          },
          {
              domain: "Network Engineering",
              text: "What does DNS stand for in networking?",
              expected: ["domain", "system", "name", "resolution"],
              options: [
                  "Domain Naming System",
                  "Domain Name Security",
                  "Dynamic Name Service",
                  "Domain Name System"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "DNS stands for Domain Name System, which translates human-readable domain names into IP addresses."
          },
          {
              domain: "Network Engineering",
              text: "Which topology connects all devices to a single communication line?",
              expected: ["bus", "star", "mesh", "ring"],
              options: [
                  "Star Topology",
                  "Bus Topology",
                  "Mesh Topology",
                  "Ring Topology"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "A Bus Topology connects all devices to a single communication line, with terminators at both ends to prevent signal reflection."
          },
          {
              domain: "Network Engineering",
              text: "What is the function of a switch in a network?",
              expected: ["connecting", "devices", "frame", "data"],
              options: [
                  "To connect separate networks",
                  "To route packets to their destination",
                  "To connect devices in a local area network and forward frames based on MAC addresses",
                  "To filter incoming traffic"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "A switch connects devices in a local area network and forwards frames based on MAC addresses, improving network efficiency."
          },
          {
              domain: "Network Engineering",
              text: "Which of the following protocols is used for email transmission?",
              expected: ["smtp", "http", "ftp", "snmp"],
              options: [
                  "SMTP (Simple Mail Transfer Protocol)",
                  "FTP (File Transfer Protocol)",
                  "SNMP (Simple Network Management Protocol)",
                  "HTTP (Hypertext Transfer Protocol)"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "SMTP (Simple Mail Transfer Protocol) is used for transmitting and delivering email across networks."
          },
          {
              domain: "Network Engineering",
              text: "What is NAT and its primary purpose?",
              expected: ["network", "address", "translation", "security"],
              options: [
                  "Network Address Translation; to provide an additional layer of security",
                  "Network Address Table; for managing IP addresses",
                  "Network Application Trailing; for data tracking",
                  "Network Access Technique; for connecting devices"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "NAT (Network Address Translation) is used to remap one IP address space into another, primarily to allow multiple devices to share a single public IP address."
          },
          {
              domain: "Network Engineering",
              text: "Which layer of the OSI model is responsible for data encryption and decryption?",
              expected: ["presentation", "application", "session", "transport"],
              options: [
                  "Transport Layer",
                  "Session Layer",
                  "Application Layer",
                  "Presentation Layer"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "The Presentation Layer of the OSI model is responsible for data encryption, decryption, and data format translation."
          },
          {
              domain: "Network Engineering",
              text: "What is a subnet mask used for?",
              expected: ["network", "dividing", "segments", "address"],
              options: [
                  "To hide IP addresses from unauthorized access",
                  "To divide an IP address into network and host segments",
                  "To determine the speed of network traffic",
                  "To encrypt network data"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "A subnet mask is used to divide an IP address into network and host segments, determining which part identifies the network."
          },
          {
              domain: "Network Engineering",
              text: "Which device is used to extend the range of a wireless network?",
              expected: ["repeater", "router", "switch", "hub"],
              options: [
                  "Router",
                  "Switch",
                  "Repeater",
                  "Hub"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "A Repeater is used to extend the range of a wireless network by amplifying the signal to reach further distances."
          },
          {
              domain: "Network Engineering",
              text: "What is the default port number for HTTP?",
              expected: ["port", "default", "web", "http"],
              options: [
                  "21",
                  "80",
                  "443",
                  "25"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The default port number for HTTP (Hypertext Transfer Protocol) is 80."
          },
          {
              domain: "Network Engineering",
              text: "What does VLAN stand for?",
              expected: ["virtual", "local", "area", "network"],
              options: [
                  "Virtual Local Area Network",
                  "Virtual Link Area Network",
                  "Variable Local Access Network",
                  "Visual Local Area Network"
              ],
              correctOption: 0,
              isMockQuestion: true,
              answer: "VLAN stands for Virtual Local Area Network, which segments networks to improve performance and security."
          },
          {
              domain: "Network Engineering",
              text: "Which protocol is responsible for dynamically assigning IP addresses to devices on a network?",
              expected: ["dhcp", "dns", "http", "ftp"],
              options: [
                  "DNS (Domain Name System)",
                  "DHCP (Dynamic Host Configuration Protocol)",
                  "HTTP (Hypertext Transfer Protocol)",
                  "FTP (File Transfer Protocol)"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "DHCP (Dynamic Host Configuration Protocol) dynamically assigns IP addresses to devices on a network."
          },
          {
              domain: "Network Engineering",
              text: "What is the purpose of a firewall in a network?",
              expected: ["security", "traffic", "filtering", "threats"],
              options: [
                  "To manage network speed",
                  "To filter and control incoming and outgoing network traffic",
                  "To provide a wireless network connection",
                  "To connect multiple computers"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The purpose of a firewall in a network is to filter and control incoming and outgoing network traffic to enhance security."
          },
          {
              domain: "Network Engineering",
              text: "What type of cable is commonly used for high-speed internet connections?",
              expected: ["fiber", "copper", "coaxial", "twisted"],
              options: [
                  "Twisted Pair Cable",
                  "Coaxial Cable",
                  "Fiber Optic Cable",
                  "Copper Cable"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "Fiber Optic Cable is commonly used for high-speed internet connections due to its ability to transmit data over long distances at high speeds."
          },
          {
              domain: "Network Engineering",
              text: "Which layer of the OSI model deals with end-to-end connections and data flow control?",
              expected: ["transport", "network", "data", "session"],
              options: [
                  "Network Layer",
                  "Transport Layer",
                  "Data Link Layer",
                  "Session Layer"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "The Transport Layer deals with end-to-end connections and controls the flow of data between hosts."
          },
          {
              domain: "Network Engineering",
              text: "What is the purpose of port forwarding?",
              expected: ["services", "access", "internet", "device"],
              options: [
                  "To restrict access to specific ports",
                  "To forward traffic from one device to another",
                  "To allow external devices to access services on a local network",
                  "To increase network speed"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "Port forwarding allows external devices to access services on a local network by redirecting traffic from a specified port."
          },
          {
              domain: "Network Engineering",
              text: "Which type of addressing uses a combination of MAC addresses and IP addresses?",
              expected: ["hybrid", "network", "data", "link"],
              options: [
                  "HTTP Addressing",
                  "IPv4 Addressing",
                  "Hybrid Addressing",
                  "Ethernet Addressing"
              ],
              correctOption: 3,
              isMockQuestion: true,
              answer: "Ethernet Addressing uses a combination of MAC addresses (data link layer) and IP addresses (network layer) to facilitate communication."
          },
          {
              domain: "Network Engineering",
              text: "What is the primary function of the Network Layer in the OSI model?",
              expected: ["routing", "data", "packets", "transport"],
              options: [
                  "To manage data encryption and decryption",
                  "To establish sessions between devices",
                  "To route packets from source to destination",
                  "To provide reliable data transfer"
              ],
              correctOption: 2,
              isMockQuestion: true,
              answer: "The primary function of the Network Layer is to route packets from the source to the destination across networks."
          },
          {
              domain: "Network Engineering",
              text: "What type of attack involves intercepting communication between two parties?",
              expected: ["man-in-the-middle", "brute-force", "phishing", "dDoS"],
              options: [
                  "Denial of Service (DoS)",
                  "Man-in-the-Middle Attack",
                  "Distributed Denial of Service (DDoS)",
                  "SQL Injection"
              ],
              correctOption: 1,
              isMockQuestion: true,
              answer: "A Man-in-the-Middle Attack involves intercepting communication between two parties to eavesdrop or manipulate the data."
          },
        //CyberSecurity
        {
          domain: "Cybersecurity",
          text: "What is a firewall?",
          expected: ["security", "network", "control", "filter"],
          options: [
              "A network security device that monitors and controls incoming and outgoing traffic",
              "A type of malware",
              "A user authentication method",
              "A form of encryption"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A firewall is a security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules."
      },
      {
          domain: "Cybersecurity",
          text: "What does 'malware' stand for?",
          expected: ["malicious", "software", "intent", "harm"],
          options: [
              "Malicious software designed to harm, exploit, or otherwise compromise a computer system",
              "Any software that is outdated",
              "Software that protects against viruses",
              "General software used in business applications"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Malware stands for malicious software designed to harm, exploit, or compromise a computer system."
      },
      {
          domain: "Cybersecurity",
          text: "What is phishing?",
          expected: ["fraud", "scam", "credentials", "deceptive"],
          options: [
              "A fraudulent attempt to obtain sensitive information by pretending to be a trustworthy entity",
              "A legitimate data collection method",
              "An online transaction",
              "A type of encryption"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Phishing is a fraudulent attempt to obtain sensitive information by pretending to be a trustworthy entity, usually through email."
      },
      {
          domain: "Cybersecurity",
          text: "What is a DDoS attack?",
          expected: ["distributed", "denial", "service", "attack"],
          options: [
              "Distributed Denial of Service attack aimed at overwhelming a service with traffic",
              "Direct Data Online Service attack",
              "A method of stealing data from a database",
              "A backup strategy for networks"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A DDoS attack is a Distributed Denial of Service attack aimed at overwhelming a service with traffic, making it unavailable."
      },
      {
          domain: "Cybersecurity",
          text: "What is two-factor authentication (2FA)?",
          expected: ["security", "verification", "methods", "identity"],
          options: [
              "An additional layer of security that requires two forms of verification to access accounts",
              "A method of data encryption",
              "A backup process",
              "A reporting technique"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Two-factor authentication (2FA) is an additional layer of security that requires two forms of verification to access accounts."
      },
      {
          domain: "Cybersecurity",
          text: "What does 'encryption' do?",
          expected: ["secure", "data", "transmission", "transform"],
          options: [
              "Transforms data into a secure format so that only authorized parties can read it",
              "Safeguards data using passwords",
              "Copies data to another location",
              "Analyzes data for vulnerabilities"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Encryption transforms data into a secure format so that only authorized parties can read it."
      },
      {
          domain: "Cybersecurity",
          text: "What is social engineering in cybersecurity?",
          expected: ["manipulation", "human", "trust", "information"],
          options: [
              "The manipulation of individuals into providing confidential information by deceiving them",
              "A software development method",
              "Only a phishing technique",
              "A network analysis process"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Social engineering in cybersecurity refers to the manipulation of individuals into providing confidential information by deceiving them."
      },
      {
          domain: "Cybersecurity",
          text: "What is a security patch?",
          expected: ["update", "software", "vulnerabilities", "fix"],
          options: [
              "An update designed to fix a security vulnerability in software",
              "A temporary solution for a hardware issue",
              "A backup for antivirus software",
              "A method for data recovery"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A security patch is an update designed to fix a security vulnerability in software."
      },
      {
          domain: "Cybersecurity",
          text: "What does 'ransomware' do?",
          expected: ["encrypts", "data", "demand", "pay"],
          options: [
              "Malicious software that encrypts data and demands payment for the decryption key",
              "A type of backup software",
              "Software that protects against viruses",
              "A method of data analysis"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Ransomware is malicious software that encrypts data and demands payment for the decryption key."
      },
      {
          domain: "Cybersecurity",
          text: "What is a brute force attack?",
          expected: ["guess", "password", "credentials", "hacking"],
          options: [
              "A method of gaining unauthorized access by trying many combinations of passwords until one works",
              "An attempt to delete data",
              "A method of encrypting passwords",
              "A type of data gathering technique"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A brute force attack is a method of gaining unauthorized access by trying many combinations of passwords until one succeeds."
      },
      {
          domain: "Cybersecurity",
          text: "What is a VPN?",
          expected: ["virtual", "private", "network", "secure"],
          options: [
              "A Virtual Private Network that creates a secure connection over the internet",
              "A type of malware protection",
              "A client-server model",
              "A method for data encryption"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A VPN is a Virtual Private Network that creates a secure connection over the internet, protecting data privacy."
      },
      {
          domain: "Cybersecurity",
          text: "What is data breach?",
          expected: ["unauthorized", "access", "information", "leakage"],
          options: [
              "The unauthorized access and retrieval of sensitive information from a system",
              "A method of data backup",
              "A security feature",
              "A data analysis technique"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A data breach is the unauthorized access and retrieval of sensitive information from a system."
      },
      {
          domain: "Cybersecurity",
          text: "What does SSL stand for?",
          expected: ["secure", "sockets", "layer", "protocol"],
          options: [
              "Secure Sockets Layer, a protocol for establishing a secure connection over the internet",
              "Simple Socket Layer",
              "Standard Secure Layer",
              "Secure System Layer"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "SSL stands for Secure Sockets Layer, a protocol for establishing a secure connection over the internet."
      },
      {
          domain: "Cybersecurity",
          text: "What is an intrusion detection system (IDS)?",
          expected: ["monitoring", "network", "threats", "activities"],
          options: [
              "A system that monitors network traffic for suspicious activities and potential threats",
              "A method of data backup",
              "A software tool for managing firewalls",
              "A form of multi-factor authentication"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "An intrusion detection system (IDS) monitors network traffic for suspicious activities and potential threats."
      },
      {
          domain: "Cybersecurity",
          text: "What is a common method for secure password management?",
          expected: ["encryption", "hashing", "auditing", "storage"],
          options: [
              "Hashing passwords before storing them in a database",
              "Storing passwords in plain text",
              "Using passwords that are easily memorable",
              "Only changing passwords every few years"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A common method for secure password management is to hash passwords before storing them in a database."
      },
      {
          domain: "Cybersecurity",
          text: "What is penetration testing?",
          expected: ["simulating", "attacks", "vulnerabilities", "system"],
          options: [
              "The practice of simulating attacks on a system to identify vulnerabilities",
              "A method of data backup",
              "Creating firewalls",
              "Analyzing network traffic"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "Penetration testing is the practice of simulating attacks on a system to identify vulnerabilities and weaknesses."
      },
      {
          domain: "Cybersecurity",
          text: "What does the principle of least privilege entail?",
          expected: ["access", "permissions", "limited", "user"],
          options: [
              "Providing users with the minimum level of access necessary to perform their job functions",
              "Allowing users full access to all systems",
              "A method for data encryption",
              "A backup policy"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The principle of least privilege entails providing users with the minimum level of access necessary to perform their job functions."
      },
      {
          domain: "Cybersecurity",
          text: "What is a digital signature?",
          expected: ["authentication", "document", "integrity", "verification"],
          options: [
              "A cryptographic technique used to verify the authenticity and integrity of a message or document",
              "A method for data compression",
              "A way to back up data",
              "A social engineering tactic"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A digital signature is a cryptographic technique used to verify the authenticity and integrity of a message or document."
      },
      {
          domain: "Cybersecurity",
          text: "What is the main goal of cybersecurity?",
          expected: ["protection", "data", "availability", "integrity"],
          options: [
              "To protect information systems from theft, damage, or disruption",
              "To increase system performance",
              "To promote software sales",
              "To improve user experience"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The main goal of cybersecurity is to protect information systems from theft, damage, or disruption."
      },
      //Mobile Development
      
        {
            domain: "Mobile Development",
            text: "What is the main reason for using a responsive design in mobile applications?",
            expected: ["adaptation", "user", "experience", "screen"],
            options: [
                "To adapt the app to different screen sizes and orientations",
                "To reduce development time",
                "To improve server response times",
                "To simplify the user interface"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Responsive design is used in mobile applications to adapt the app to different screen sizes and orientations, enhancing user experience."
        },
        {
            domain: "Mobile Development",
            text: "Which programming language is primarily used for Android app development?",
            expected: ["java", "android", "swift", "csharp"],
            options: [
                "Kotlin",
                "Swift",
                "Java",
                "C#"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Java is primarily used for Android app development, although Kotlin is becoming increasingly popular as well."
        },
        {
            domain: "Mobile Development",
            text: "Which framework is used for building cross-platform mobile applications?",
            expected: ["flutter", "native", "xcode", "androidstudio"],
            options: [
                "React Native",
                "Xamarin",
                "Flutter",
                "All of the Above"
            ],
            correctOption: 3,
            isMockQuestion: true,
            answer: "All of the Above frameworks—React Native, Xamarin, and Flutter—are used for building cross-platform mobile applications."
        },
        {
            domain: "Mobile Development",
            text: "What is the use of the Android Manifest file?",
            expected: ["configuration", "settings", "permissions", "application"],
            options: [
                "To configure app permissions and settings",
                "To define the database schema",
                "To manage API calls",
                "To handle user sessions"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "The Android Manifest file is used to configure app permissions and settings, declaring essential information about the application."
        },
        {
            domain: "Mobile Development",
            text: "What is the primary purpose of using Virtual Device Emulators?",
            expected: ["testing", "development", "environment", "applications"],
            options: [
                "To create virtual devices for testing applications",
                "To visualize the database",
                "To manage app performance",
                "To develop hardware components"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Virtual Device Emulators are used to create virtual devices for testing applications without needing physical hardware."
        },
        {
            domain: "Mobile Development",
            text: "Which component is used in Android for managing lifecycle and UI updates?",
            expected: ["activity", "fragment", "context", "service"],
            options: [
                "Service",
                "Fragment",
                "Context",
                "Activity"
            ],
            correctOption: 3,
            isMockQuestion: true,
            answer: "Activity is used in Android for managing the lifecycle and UI updates of an application."
        },
        {
            domain: "Mobile Development",
            text: "What is the purpose of a ViewModel in mobile app architecture?",
            expected: ["data", "pictures", "user", "presentation"],
            options: [
                "To store UI-related data and survive configuration changes",
                "To handle navigation between views",
                "To update the database",
                "To manage API responses"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A ViewModel in mobile app architecture is used to store UI-related data and survive configuration changes without losing state."
        },
        {
            domain: "Mobile Development",
            text: "Which of the following is an iOS development language?",
            expected: ["swift", "java", "kotlin", "html"],
            options: [
                "Swift",
                "Java",
                "C++",
                "HTML"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Swift is an iOS development language primarily used for building applications on Apple platforms."
        },
        {
            domain: "Mobile Development",
            text: "What is the function of Push Notifications?",
            expected: ["alerts", "information", "users", "messages"],
            options: [
                "To send alerts or information to users even when the application is not running",
                "To manage app settings",
                "To update the app's database",
                "To control network connections"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "Push Notifications are used to send alerts or information to users even when the application is not running, keeping users engaged."
        },
        {
            domain: "Mobile Development",
            text: "In mobile development, what does API stand for?",
            expected: ["application", "programming", "interface", "software"],
            options: [
                "Application Programming Interface",
                "Application Performance Interface",
                "Advanced Program Integration",
                "Application Programming Internet"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "API stands for Application Programming Interface, which allows different software applications to communicate with each other."
        },
        {
            domain: "Mobile Development",
            text: "Which tool is commonly used for debugging mobile applications?",
            expected: ["android studio", "xcode", "eclipse", "all"],
            options: [
                "Android Studio",
                "Xcode",
                "Eclipse",
                "All of the Above"
            ],
            correctOption: 3,
            isMockQuestion: true,
            answer: "All of the Above tools—Android Studio, Xcode, and Eclipse—are commonly used for debugging mobile applications."
        },
        {
            domain: "Mobile Development",
            text: "What is an advantage of using hybrid mobile app development?",
            expected: ["cost", "development", "platforms", "web"],
            options: [
                "Higher cost of development",
                "Faster time to market due to single codebase",
                "Need for multiple codebases for different platforms",
                "Lesser performance compared to native apps"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "An advantage of hybrid mobile app development is faster time to market due to a single codebase for multiple platforms."
        },
        {
            domain: "Mobile Development",
            text: "Which of the following best describes a native mobile application?",
            expected: ["device", "platform", "specific", "performance"],
            options: [
                "An app developed for a specific device platform using platform-specific languages",
                "An app that runs in a web browser",
                "An app that can be used on any platform without modifications",
                "An app that requires an internet connection to function"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "A native mobile application is developed for a specific device platform using platform-specific languages, e.g., Swift for iOS and Java for Android."
        },
        {
            domain: "Mobile Development",
            text: "What does Agile methodology emphasize in mobile development?",
            expected: ["collaboration", "documentation", "planning", "change"],
            options: [
                "Extensive documentation",
                "Sequential development phases",
                "Flexibility and collaboration with continuous improvement",
                "Rigid plans that must be followed strictly"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Agile methodology emphasizes flexibility and collaboration with continuous improvement in mobile development processes."
        },
        {
            domain: "Mobile Development",
            text: "Which framework is used to build mobile applications using Web Technologies?",
            expected: ["cordova", "native", "swift", "kotlin"],
            options: [
                "Node.js",
                "Laravel",
                "Cordova",
                "Django"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "Cordova is a framework used to build mobile applications using Web Technologies, allowing for development with HTML, CSS, and JavaScript."
        },
        {
            domain: "Mobile Development",
            text: "What is the purpose of an App Store?",
            expected: ["distribution", "applications", "customers", "developers"],
            options: [
                "To allow developers to showcase their apps",
                "To provide a platform for marketing",
                "To distribute applications to users",
                "All of the Above"
            ],
            correctOption: 3,
            isMockQuestion: true,
            answer: "An App Store serves all of the Above purposes by allowing developers to showcase, market, and distribute applications to users."
        },
        {
            domain: "Mobile Development",
            text: "Which of the following concepts emphasizes the importance of user experience in mobile applications?",
            expected: ["ux", "ui", "design", "development"],
            options: [
                "User Design",
                "User Intensive Design",
                "User Experience (UX)",
                "User Interface (UI)"
            ],
            correctOption: 2,
            isMockQuestion: true,
            answer: "User Experience (UX) emphasizes the importance of creating applications that provide a positive and efficient experience to users."
        },
        {
            domain: "Mobile Development",
            text: "What is the primary function of an API Gateway?",
            expected: ["management", "request", "traffic", "services"],
            options: [
                "To provide a public-facing endpoint for accessing microservices",
                "To manage database connections",
                "To store user data",
                "To monitor network traffic"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "An API Gateway acts as a public-facing endpoint for accessing microservices, managing requests and aggregating responses."
        },
        {
            domain: "Mobile Development",
            text: "What is a common reason for app performance degradation?",
            expected: ["memory", "usage", "timeout", "network"],
            options: [
                "High memory usage or memory leaks",
                "Slow network connections",
                "Unsupported devices",
                "Lack of user feedback"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "High memory usage or memory leaks are common reasons for app performance degradation, leading to slow response times."
        },
        {
            domain: "Mobile Development",
            text: "Which testing method involves the end-user in the evaluation process of a mobile application?",
            expected: ["user testing", "unit testing", "integration testing", "functional testing"],
            options: [
                "User Acceptance Testing (UAT)",
                "Test-Driven Development (TDD)",
                "Automated Testing",
                "Regression Testing"
            ],
            correctOption: 0,
            isMockQuestion: true,
            answer: "User Acceptance Testing (UAT) involves end-users in the evaluation process of a mobile application to ensure it meets their needs."
        },
        {
            domain: "Mobile Development",
            text: "What is the role of local storage in mobile applications?",
            expected: ["data", "offline", "memory", "device"],
            options: [
                "To permanently store large files",
                "To provide offline access to data",
                "To only cache temporary data",
                "To manage device resources"
            ],
            correctOption: 1,
            isMockQuestion: true,
            answer: "The role of local storage in mobile applications is to provide offline access to data, allowing users to interact with the app without an internet connection."
        },
      //Artificial Intelligence 
      {
        domain: "Artificial Intelligence",
        text: "What is Artificial Intelligence (AI)?",
        expected: ["simulation", "human", "intelligence", "machines"],
        options: [
            "The simulation of human intelligence processes by computer systems",
            "A type of computer hardware",
            "A programming language",
            "A method of data analysis"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is machine learning?",
        expected: ["algorithms", "data", "learning", "improvement"],
        options: [
            "A subset of AI that uses algorithms to enable computers to learn from and make predictions based on data",
            "A type of neural network",
            "A programming paradigm",
            "An artificial neural network structure"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Machine learning is a subset of AI that uses algorithms to enable computers to learn from and make predictions based on data."
    },
    {
        domain: "Artificial Intelligence",
        text: "What does the term 'deep learning' refer to?",
        expected: ["neural", "networks", "layers", "learning"],
        options: [
            "A type of machine learning that uses neural networks with many layers to analyze various factors of data",
            "A simple form of AI",
            "A specific learning algorithm",
            "A programming language for AI"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Deep learning refers to a type of machine learning that uses neural networks with many layers to analyze various factors of data."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is natural language processing (NLP)?",
        expected: ["human", "language", "computers", "interaction"],
        options: [
            "The ability of a computer program to understand, interpret, and generate human language",
            "A type of coding language",
            "A method for data visualization",
            "The simulation of human emotions by AI"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Natural language processing (NLP) is the ability of a computer program to understand, interpret, and generate human language."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is a neural network?",
        expected: ["algorithm", "structure", "layers", "data"],
        options: [
            "A computational model inspired by the human brain, consisting of interconnected nodes (neurons)",
            "A type of database",
            "A networking protocol",
            "A user interface design"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "A neural network is a computational model inspired by the human brain, consisting of interconnected nodes (neurons)."
    },
    {
        domain: "Artificial Intelligence",
        text: "What does 'computer vision' enable computers to do?",
        expected: ["image", "recognition", "interpret", "data"],
        options: [
            "Interpret and process visual information from the world, such as images and videos",
            "Perform mathematical calculations",
            "Manage databases",
            "Write programming code"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Computer vision enables computers to interpret and process visual information from the world, such as images and videos."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is reinforcement learning?",
        expected: ["training", "agent", "rewards", "environment"],
        options: [
            "A type of machine learning where an agent learns to make decisions by receiving rewards or penalties in an environment",
            "An unsupervised learning method",
            "A natural language processing approach",
            "A data classification technique"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Reinforcement learning is a type of machine learning where an agent learns to make decisions by receiving rewards or penalties in an environment."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is the Turing Test?",
        expected: ["intelligence", "human", "machine", "response"],
        options: [
            "A test to determine if a machine exhibits human-like intelligence based on its responses",
            "A performance metric for algorithms",
            "A programming challenge",
            "A test for data accuracy"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "The Turing Test is a test to determine if a machine exhibits human-like intelligence based on its responses."
    },
    {
        domain: "Artificial Intelligence",
        text: "What are chatbots?",
        expected: ["automated", "conversational", "AI", "systems"],
        options: [
            "Automated systems that can simulate conversation with users via text or voice",
            "Computer viruses",
            "Data management tools",
            "Social media platforms"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Chatbots are automated systems that can simulate conversation with users via text or voice."
    },
    {
        domain: "Artificial Intelligence",
        text: "What does 'data mining' involve?",
        expected: ["extracting", "patterns", "data", "analysis"],
        options: [
            "Extracting useful information and patterns from large sets of data",
            "Cleaning data",
            "Encrypting information",
            "Backing up data"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Data mining involves extracting useful information and patterns from large sets of data."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is an AI model?",
        expected: ["mathematical", "representation", "data", "learning"],
        options: [
            "A mathematical representation trained on data to perform specific tasks or make predictions",
            "A type of programming language",
            "A hardware specification",
            "An operational protocol"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "An AI model is a mathematical representation trained on data to perform specific tasks or make predictions."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is supervised learning?",
        expected: ["labeled", "training", "data", "predictions"],
        options: [
            "A machine learning approach where the model is trained on labeled data to make predictions",
            "Learning without any human intervention",
            "A method of data sorting",
            "A type of reinforcement learning"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Supervised learning is a machine learning approach where the model is trained on labeled data to make predictions."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is unsupervised learning?",
        expected: ["patterns", "data", "analysis", "labeling"],
        options: [
            "A type of machine learning where the model is trained on data without labels, aiming to find patterns or groupings",
            "A training method with clearly defined outputs",
            "A data sorting technique",
            "A method of data encryption"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Unsupervised learning is a type of machine learning where the model is trained on data without labels, aiming to find patterns or groupings."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is the purpose of AI ethics?",
        expected: ["guidelines", "responsibility", "development", "impact"],
        options: [
            "To provide guidelines for the responsible development and use of AI technologies",
            "To promote AI programming languages",
            "To enhance system performance",
            "To develop gaming applications"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "AI ethics aims to provide guidelines for the responsible development and use of AI technologies."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is a generative adversarial network (GAN)?",
        expected: ["two", "neural", "networks", "training"],
        options: [
            "A framework involving two neural networks that compete against each other to generate new data instances",
            "A type of machine learning model",
            "A specific data visualization technique",
            "An approach to data encryption"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "A generative adversarial network (GAN) is a framework involving two neural networks that compete against each other to generate new data instances."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is a knowledge base?",
        expected: ["store", "information", "data", "system"],
        options: [
            "A store of knowledge structured in a way that allows easy access and retrieval for AI applications",
            "A software development kit",
            "A programming language",
            "A database for operational data"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "A knowledge base is a store of knowledge structured for easy access and retrieval for AI applications."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is sentiment analysis?",
        expected: ["text", "emotion", "understanding", "data"],
        options: [
            "A technique in NLP used to determine the sentiment or emotion behind a piece of text",
            "A method for data categorization",
            "An encryption technique for sensitive data",
            "A type of user interface"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Sentiment analysis is a technique in NLP used to determine the sentiment or emotion behind a piece of text."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is autonomous learning?",
        expected: ["self-directed", "learning", "AI", "process"],
        options: [
            "A process where systems autonomously learn and adapt without human intervention",
            "A supervised learning method",
            "A reinforcement learning approach",
            "A manual programming method"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Autonomous learning is a process where systems learn and adapt without human intervention."
    },
    {
        domain: "Artificial Intelligence",
        text: "What is the purpose of reinforcement learning?",
        expected: ["decisions", "agent", "environment", "rewards"],
        options: [
            "To train an agent to make decisions in an environment by maximizing cumulative rewards",
            "To classify data",
            "To provide information",
            "To generate images"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "The purpose of reinforcement learning is to train an agent to make decisions in an environment by maximizing cumulative rewards."
    },
    //Game Development 
    
      {
          domain: "Game Development",
          text: "What is the primary purpose of a game engine?",
          expected: ["development", "tools", "software", "design"],
          options: [
              "To create audio assets",
              "To develop marketing strategies",
              "To provide tools and frameworks for game development",
              "To store game data"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "The primary purpose of a game engine is to provide tools and frameworks that facilitate the development of games."
      },
      {
          domain: "Game Development",
          text: "Which programming language is commonly used for game development in Unity?",
          expected: ["csharp", "java", "python", "c++"],
          options: [
              "Java",
              "C++",
              "C#",
              "JavaScript"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "C# is commonly used for game development in Unity, as it is the primary scripting language supported by the engine."
      },
      {
          domain: "Game Development",
          text: "What does 'FPS' stand for in gaming?",
          expected: ["frames", "per", "second", "performance"],
          options: [
              "Frames Per Second",
              "First Person Shooter",
              "Fast Processing System",
              "Frequency Per Second"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "'FPS' stands for Frames Per Second, which measures how many individual frames are rendered in one second of gameplay."
      },
      {
          domain: "Game Development",
          text: "Which component is essential for implementing physics in a game?",
          expected: ["engine", "gravity", "collision", "gameplay"],
          options: [
              "Graphics Rendering",
              "Sound Management",
              "Physics Engine",
              "Animation System"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "A Physics Engine is essential for implementing physics in a game, allowing for realistic movement, collisions, and interactions."
      },
      {
          domain: "Game Development",
          text: "What is the purpose of game assets?",
          expected: ["graphics", "sounds", "animations", "visuals"],
          options: [
              "To provide financial backing for the game",
              "To create gameplay mechanics",
              "To provide graphical, audio, and interactive elements",
              "To manage game data"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "Game assets provide graphical, audio, and interactive elements that make up the content and experience of a game."
      },
      {
          domain: "Game Development",
          text: "Which of the following is a popular game engine used for mobile game development?",
          expected: ["unity", "unreal", "godot", "all"],
          options: [
              "Unity",
              "Unreal Engine",
              "Godot",
              "All of the Above"
          ],
          correctOption: 3,
          isMockQuestion: true,
          answer: "All of the Above game engines—Unity, Unreal Engine, and Godot—are popular for mobile game development."
      },
      {
          domain: "Game Development",
          text: "What is 'level design' in game development?",
          expected: ["game", "structure", "environment", "play"],
          options: [
              "Creating the storyline of the game",
              "Designing the user interface",
              "Planning and structuring the game environment and challenges",
              "Coding the gameplay mechanics"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "Level design involves planning and structuring the game environment, including challenges and layout, to enhance the player experience."
      },
      {
          domain: "Game Development",
          text: "What is the purpose of playtesting in game development?",
          expected: ["feedback", "development", "improvement", "testing"],
          options: [
              "To finalize the game's graphics",
              "To gather feedback and identify bugs or gameplay issues",
              "To market the game",
              "To distribute the game to players"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Playtesting is conducted to gather feedback and identify bugs or gameplay issues, allowing developers to improve the game."
      },
      {
          domain: "Game Development",
          text: "Which of the following is NOT a game genre?",
          expected: ["platformer", "simulation", "narrative", "oceanography"],
          options: [
              "Platformer",
              "Simulation",
              "Narrative",
              "Oceanography"
          ],
          correctOption: 3,
          isMockQuestion: true,
          answer: "Oceanography is NOT a game genre; however, Platformer, Simulation, and Narrative are common game genres."
      },
      {
          domain: "Game Development",
          text: "What is a 'sprite' in game development?",
          expected: ["2D", "graphic", "image", "object"],
          options: [
              "A 2D image or animation that represents a character, object, or effect",
              "A game level component",
              "The game's background music",
              "A type of game engine"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "A sprite is a 2D image or animation that represents a character, object, or effect in a game."
      },
      {
          domain: "Game Development",
          text: "What does AI refer to in the context of games?",
          expected: ["artificial", "intelligence", "behaviors", "characters"],
          options: [
              "Artificial Intelligence; the behaviors programmed for non-player characters",
              "Automated Interaction; for user engagement",
              "Advanced Interface; for better graphics",
              "Adaptive Input; for player control"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "In the context of games, AI refers to Artificial Intelligence, specifically the behaviors programmed for non-player characters."
      },
      {
          domain: "Game Development",
          text: "What is the importance of a game loop?",
          expected: ["cycle", "updates", "gameplay", "rendering"],
          options: [
              "To finalize the game design",
              "To create marketing strategies",
              "To control the flow of gameplay and updates in the game",
              "To manage player accounts"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "A game loop is important as it controls the flow of gameplay and updates, continuously processing user input and rendering graphics."
      },
      {
          domain: "Game Development",
          text: "What do 'collision detection' algorithms do in games?",
          expected: ["interactions", "objects", "physics", "gameplay"],
          options: [
              "To manage graphics rendering",
              "To determine when two or more objects interact within the game environment",
              "To handle sound effects",
              "To calculate player scores"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Collision detection algorithms determine when two or more objects interact within the game environment, essential for gameplay mechanics."
      },
      {
          domain: "Game Development",
          text: "Which of the following is NOT a type of game monetization strategy?",
          expected: ["free-to-play", "premise", "subscription", "in-app purchases"],
          options: [
              "Free-to-Play",
              "Premium",
              "Subscription",
              "In-App Purchases"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Premium is NOT a monetization strategy; Free-to-Play, Subscription, and In-App Purchases are common methods used in game monetization."
      },
      {
          domain: "Game Development",
          text: "What is procedural generation in games?",
          expected: ["content", "algorithms", "random", "creation"],
          options: [
              "Creating static environments",
              "Using algorithms to create data and content dynamically",
              "Manually designing game levels",
              "Randomly assigning player roles"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Procedural generation refers to using algorithms to create data and content dynamically, often for game levels or environments."
      },
      {
          domain: "Game Development",
          text: "What is the purpose of shaders in game graphics?",
          expected: ["visual", "effects", "rendering", "appearance"],
          options: [
              "To manage game physics",
              "To control how models are displayed and rendered in terms of lighting and texture",
              "To store game assets",
              "To implement user interfaces"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Shaders control how models are displayed and rendered in terms of lighting and texture, greatly impacting the visual appearance of a game."
      },
      {
          domain: "Game Development",
          text: "What does 'game balance' refer to?",
          expected: ["difficulty", "fairness", "playability", "difficulty"],
          options: [
              "The visual appeal of a game",
              "Ensuring fair competition and appropriate challenge levels",
              "The rate of asset loading",
              "The number of levels in a game"
          ],
          correctOption: 1,
          isMockQuestion: true,
          answer: "Game balance refers to ensuring fair competition and appropriate challenge levels so that players have a satisfying experience."
      },
      {
          domain: "Game Development",
          text: "What is the main function of a storyboard in game development?",
          expected: ["planning", "story", "sequence", "concept"],
          options: [
              "To plan and visualize the narrative and gameplay flow",
              "To organize assets",
              "To write code",
              "To develop marketing materials"
          ],
          correctOption: 0,
          isMockQuestion: true,
          answer: "The main function of a storyboard in game development is to plan and visualize the narrative and gameplay flow, helping to organize thoughts and concepts."
      },
      {
          domain: "Game Development",
          text: "Which API is commonly used for high-performance graphics in game development?",
          expected: ["directx", "opengl", "vulkan", "all"],
          options: [
              "DirectX",
              "OpenGL",
              "Vulkan",
              "All of the Above"
          ],
          correctOption: 3,
          isMockQuestion: true,
          answer: "All of the Above APIs—DirectX, OpenGL, and Vulkan—are commonly used for high-performance graphics in game development."
      },
      {
          domain: "Game Development",
          text: "What is the purpose of sound design in games?",
          expected: ["effects", "immersive", "experience", "interaction"],
          options: [
              "To manage user input",
              "To provide visual feedback",
              "To create an immersive experience through sound effects and music",
              "To design game levels"
          ],
          correctOption: 2,
          isMockQuestion: true,
          answer: "Sound design in games serves to create an immersive experience through sound effects and music, enhancing overall gameplay."
      },
      
  
    //Backend Development
    {
      domain: "Backend Development",
      text: "What is a server?",
      expected: ["computer", "service", "request", "data"],
      options: [
          "A computer or program that provides data to other computers (clients) over a network",
          "A type of database",
          "A front-end JavaScript library",
          "A method of storing data"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A server is a computer or program that provides data to other computers (clients) over a network."
  },
  {
      domain: "Backend Development",
      text: "What is REST?",
      expected: ["architecture", "style", "API", "web"],
      options: [
          "Representational State Transfer, an architectural style for designing networked applications",
          "A database management system",
          "An encryption method",
          "A server configuration technique"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "REST (Representational State Transfer) is an architectural style for designing networked applications."
  },
  {
      domain: "Backend Development",
      text: "What is a database?",
      expected: ["collection", "data", "structured", "information"],
      options: [
          "A structured collection of data that can be easily accessed, managed, and updated",
          "A method of data encryption",
          "A type of web server",
          "A protocol for network communication"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A database is a structured collection of data that can be easily accessed, managed, and updated."
  },
  {
      domain: "Backend Development",
      text: "What does CRUD stand for?",
      expected: ["create", "read", "update", "delete"],
      options: [
          "Create, Read, Update, Delete – basic operations for managing data in a database",
          "Control, Render, Update, Design",
          "Calculate, Retrieve, Update, Discard",
          "Copy, Read, Upload, Delete"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "CRUD stands for Create, Read, Update, Delete – the basic operations for managing data in a database."
  },
  {
      domain: "Backend Development",
      text: "What is an API?",
      expected: ["application", "programming", "interface", "communication"],
      options: [
          "Application Programming Interface – a set of rules that allows one piece of software to interact with another",
          "A type of user interface",
          "A database system",
          "An algorithm for data processing"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "An API (Application Programming Interface) is a set of rules that allows one piece of software to interact with another."
  },
  {
      domain: "Backend Development",
      text: "What does middleware do?",
      expected: ["software", "intermediate", "process", "communication"],
      options: [
          "Software that acts as an intermediary between different applications or services",
          "A type of database",
          "A user interface for backend management",
          "Data storage software"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Middleware is software that acts as an intermediary between different applications or services."
  },
  {
      domain: "Backend Development",
      text: "What is Node.js?",
      expected: ["JavaScript", "runtime", "environment", "server"],
      options: [
          "A JavaScript runtime environment that allows execution of JavaScript on the server side",
          "A framework for frontend development",
          "A database technology",
          "A server configuration tool"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Node.js is a JavaScript runtime environment that allows execution of JavaScript on the server side."
  },
  {
      domain: "Backend Development",
      text: "What is a framework in backend development?",
      expected: ["tool", "structure", "software", "development"],
      options: [
          "A collection of tools and libraries that simplify the development of applications",
          "A programming language",
          "An operating system",
          "A type of database"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A framework in backend development is a collection of tools and libraries that simplify the development of applications."
  },
  {
      domain: "Backend Development",
      text: "What does SQL stand for?",
      expected: ["structured", "query", "language", "database"],
      options: [
          "Structured Query Language – a language for managing and querying databases",
          "Standard Query Language",
          "Simple Query Language",
          "Syntax Query Language"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "SQL stands for Structured Query Language, which is used for managing and querying databases."
  },
  {
      domain: "Backend Development",
      text: "What is a session in web development?",
      expected: ["temporary", "state", "information", "user"],
      options: [
          "A temporary storage of information about a user during their interaction with a web application",
          "A type of database",
          "An encryption method",
          "A networking protocol"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A session in web development is a temporary storage of information about a user during their interaction with a web application."
  },
  {
      domain: "Backend Development",
      text: "What is a web server?",
      expected: ["server", "resources", "requests", "http"],
      options: [
          "A server that handles requests from clients and serves web content via HTTP or HTTPS",
          "A type of database",
          "A front-end programming tool",
          "A user authentication method"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A web server is a server that handles requests from clients and serves web content via HTTP or HTTPS."
  },
  {
      domain: "Backend Development",
      text: "What is JSON?",
      expected: ["JavaScript", "object", "notation", "data"],
      options: [
          "JavaScript Object Notation – a lightweight data interchange format that is easy for humans to read and write",
          "A type of database",
          "A programming language",
          "A web server technology"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write."
  },
  {
      domain: "Backend Development",
      text: "What are environment variables?",
      expected: ["configuration", "settings", "variables", "application"],
      options: [
          "Configuration settings used to customize the behavior of an application in different environments",
          "Variables used in programming",
          "Type of database fields",
          "Data input methods"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Environment variables are configuration settings used to customize the behavior of an application in different environments."
  },
  {
      domain: "Backend Development",
      text: "What is authentication?",
      expected: ["identity", "user", "verification", "process"],
      options: [
          "The process of verifying the identity of a user or system",
          "A method for data security",
          "A programming technique",
          "A type of session management"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Authentication is the process of verifying the identity of a user or system."
  },
  {
      domain: "Backend Development",
      text: "What is authorization?",
      expected: ["permissions", "access", "control", "users"],
      options: [
          "The process of determining whether a user has permission to access specific resources",
          "A type of network security",
          "A methodology for data entry",
          "A method of application testing"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Authorization is the process of determining whether a user has permission to access specific resources."
  },
  {
      domain: "Backend Development",
      text: "What is a load balancer?",
      expected: ["distribute", "traffic", "servers", "resources"],
      options: [
          "A device or software that distributes network traffic across multiple servers to ensure high availability",
          "A type of database",
          "A backup system",
          "An analytics tool"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A load balancer is a device or software that distributes network traffic across multiple servers to ensure high availability."
  },
  {
      domain: "Backend Development",
      text: "What is a microservices architecture?",
      expected: ["services", "independent", "application", "structure"],
      options: [
          "An architectural style that structures an application as a collection of loosely coupled services",
          "A type of web framework",
          "A database model",
          "A frontend development approach"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Microservices architecture is an architectural style that structures an application as a collection of loosely coupled services."
  },
  {
      domain: "Backend Development",
      text: "What is caching?",
      expected: ["temporary", "storage", "data", "performance"],
      options: [
          "Storing data temporarily to improve performance by reducing load times for frequently accessed information",
          "A type of database management",
          "A method of data encryption",
          "A server configuration technique"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Caching involves storing data temporarily to improve performance by reducing load times for frequently accessed information."
  },
  {
      domain: "Backend Development",
      text: "What is a dependency manager?",
      expected: ["software", "libraries", "projects", "dependencies"],
      options: [
          "Software tools that automate the installation and management of libraries and dependencies for projects",
          "A backup software",
          "A version control system",
          "A type of database"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A dependency manager is software that automates the installation and management of libraries and dependencies for projects."
  },
  {
      domain: "Backend Development",
      text: "What is a version control system?",
      expected: ["software", "track", "changes", "management"],
      options: [
          "Software that helps track changes to files and coordinate work among multiple people",
          "A type of database",
          "A programming methodology",
          "An operating system"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A version control system is software that helps track changes to files and coordinate work among multiple people."
  },
  {
      domain: "Backend Development",
      text: "What is a SQL injection attack?",
      expected: ["security", "threat", "SQL", "database"],
      options: [
          "A security vulnerability that allows an attacker to manipulate a database by injecting SQL code",
          "A method of data encryption",
          "A type of denial of service attack",
          "A network configuration issue"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A SQL injection attack is a security vulnerability that allows an attacker to manipulate a database by injecting SQL code."
  },
  //Machine Learning 
  
    {
        domain: "Machine Learning",
        text: "What is the primary goal of supervised learning?",
        expected: ["prediction", "labels", "training", "data"],
        options: [
            "To group similar data points together",
            "To train a model on labeled data for prediction",
            "To find patterns in unlabeled data",
            "To reduce dimensionality"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "The primary goal of supervised learning is to train a model on labeled data to make accurate predictions on unseen data."
    },
    {
        domain: "Machine Learning",
        text: "Which of the following algorithms is commonly used for classification problems?",
        expected: ["decision", "trees", "regression", "clustering"],
        options: [
            "Linear Regression",
            "K-Means Clustering",
            "Support Vector Machines",
            "Principal Component Analysis"
        ],
        correctOption: 2,
        isMockQuestion: true,
        answer: "Support Vector Machines are commonly used for classification problems, helping to separate different classes in feature space."
    },
    {
        domain: "Machine Learning",
        text: "What is 'overfitting' in machine learning?",
        expected: ["model", "training", "data", "performance"],
        options: [
            "When a model performs well on training data but poorly on unseen data",
            "When model training is incomplete",
            "When a model cannot fit the data",
            "When a model has low accuracy on training data"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Overfitting occurs when a model performs well on training data but poorly on unseen data, indicating that it has learned noise rather than the underlying patterns."
    },
    {
        domain: "Machine Learning",
        text: "What is a feature in a machine learning context?",
        expected: ["input", "variable", "data", "attribute"],
        options: [
            "The output variable in a supervised learning problem",
            "The software used to implement algorithms",
            "An individual measurable property or characteristic of a phenomenon being observed",
            "The label assigned to data points in classification"
        ],
        correctOption: 2,
        isMockQuestion: true,
        answer: "In machine learning, a feature is an individual measurable property or characteristic of the data being analyzed."
    },
    {
        domain: "Machine Learning",
        text: "What does a confusion matrix allow you to assess?",
        expected: ["classification", "performance", "accuracy", "results"],
        options: [
            "The overall accuracy of the model",
            "The performance of the model on various thresholds",
            "The true vs. predicted classifications for a classification problem",
            "The model's predictions in regression problems"
        ],
        correctOption: 2,
        isMockQuestion: true,
        answer: "A confusion matrix allows you to assess the true vs. predicted classifications for a classification problem, helping understand the model's performance."
    },
    {
        domain: "Machine Learning",
        text: "What is the purpose of cross-validation?",
        expected: ["evaluation", "model", "data", "training"],
        options: [
            "To reduce bias in model evaluation",
            "To balance the dataset",
            "To automate training processes",
            "To select relevant features"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "The purpose of cross-validation is to provide a more reliable estimate of model performance and reduce bias in model evaluation."
    },
    {
        domain: "Machine Learning",
        text: "Which technique is used to reduce the dimensionality of a dataset?",
        expected: ["pca", "selection", "reduction", "transformation"],
        options: [
            "Feature Selection",
            "Principal Component Analysis (PCA)",
            "Clustering",
            "Normalization"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Principal Component Analysis (PCA) is a technique used to reduce the dimensionality of a dataset while preserving as much variance as possible."
    },
    {
        domain: "Machine Learning",
        text: "What is reinforcement learning primarily concerned with?",
        expected: ["actions", "environment", "reward", "learning"],
        options: [
            "Training models on historical data",
            "Maximizing cumulative rewards through interactions with an environment",
            "Grouping similar data for clustering",
            "Decreasing the error in predictive models"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Reinforcement learning is primarily concerned with maximizing cumulative rewards through interactions with an environment."
    },
    {
        domain: "Machine Learning",
        text: "Which evaluation metric is commonly used for regression problems?",
        expected: ["rmse", "accuracy", "recall", "precision"],
        options: [
            "Accuracy",
            "Precision",
            "F1 Score",
            "Root Mean Squared Error (RMSE)"
        ],
        correctOption: 3,
        isMockQuestion: true,
        answer: "Root Mean Squared Error (RMSE) is commonly used as an evaluation metric for regression problems to assess the differences between predicted and actual values."
    },
    {
        domain: "Machine Learning",
        text: "What is the function of a loss function in machine learning?",
        expected: ["optimization", "cost", "training", "prediction"],
        options: [
            "To measure the accuracy of the model",
            "To calculate the errors made during training",
            "To optimize the model's parameters during training",
            "To initialize the model's weights"
        ],
        correctOption: 2,
        isMockQuestion: true,
        answer: "A loss function measures the cost associated with the errors made during training, and is used to optimize the model's parameters."
    },
    {
        domain: "Machine Learning",
        text: "Which of the following is an example of unsupervised learning?",
        expected: ["clustering", "classification", "regression", "labeling"],
        options: [
            "K-Means Clustering",
            "Decision Trees",
            "Linear Regression",
            "Support Vector Machine"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "K-Means Clustering is an example of unsupervised learning, where the algorithm groups similar data points without prior labels."
    },
    {
        domain: "Machine Learning",
        text: "What does the term 'training set' refer to?",
        expected: ["data", "used", "learn", "test"],
        options: [
            "The data used to validate the model's performance",
            "The data used to train a machine learning model",
            "The data used for feature selection",
            "The final evaluation of the model"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "The 'training set' refers to the data used to train a machine learning model so that it can learn from the provided examples."
    },
    {
        domain: "Machine Learning",
        text: "Which of the following is a common method for handling missing values in a dataset?",
        expected: ["imputation", "deletion", "estimation", "filling"],
        options: [
            "Imputation",
            "Deletion",
            "Random Sampling",
            "All of the Above"
        ],
        correctOption: 3,
        isMockQuestion: true,
        answer: "All of the Above methods—Imputation, Deletion, and Random Sampling—are common methods for handling missing values in a dataset."
    },
    {
        domain: "Machine Learning",
        text: "What is the purpose of regularization in machine learning?",
        expected: ["complexity", "overfitting", "model", "training"],
        options: [
            "To increase model complexity",
            "To reduce overfitting by adding a penalty for larger coefficients",
            "To select the features used for training",
            "To improve model accuracy on training data"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Regularization is used to reduce overfitting by adding a penalty for larger coefficients in the model, thus simplifying it."
    },
    {
        domain: "Machine Learning",
        text: "Which term describes an ensemble learning method that combines predictions from multiple models?",
        expected: ["bagging", "boosting", "stacking", "all"],
        options: [
            "Bagging",
            "Boosting",
            "Stacking",
            "All of the Above"
        ],
        correctOption: 3,
        isMockQuestion: true,
        answer: "All of the Above—Bagging, Boosting, and Stacking—are ensemble learning methods that combine predictions from multiple models to improve accuracy."
    },
    {
        domain: "Machine Learning",
        text: "What is the purpose of feature scaling?",
        expected: ["normalization", "standardization", "data", "size"],
        options: [
            "To reduce computational time",
            "To normalize the range of the data and bring features to a similar scale",
            "To eliminate duplicate features",
            "To convert categorical features into numeric values"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Feature scaling is used to normalize the range of data and bring features to a similar scale, which is important for many algorithms."
    },
    {
        domain: "Machine Learning",
        text: "What does 'hyperparameter tuning' involve?",
        expected: ["parameter", "model", "optimization", "selection"],
        options: [
            "Adjusting the weights of a trained model",
            "Choosing the structure of the neural network",
            "Optimizing settings that are not learned during training",
            "Reducing the size of the model"
        ],
        correctOption: 2,
        isMockQuestion: true,
        answer: "Hyperparameter tuning involves optimizing settings that are not learned during the training process, such as learning rates and batch sizes."
    },
    {
        domain: "Machine Learning",
        text: "What type of problem does clustering address?",
        expected: ["segmentation", "classification", "identification", "prediction"],
        options: [
            "Categorizing data into predefined classes",
            "Segmentation of data into groups based on similarity",
            "Predicting future data points",
            "Regression analysis of continuous data"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Clustering addresses the problem of segmenting data into groups based on their similarity, without predefined classes."
    },
    {
        domain: "Machine Learning",
        text: "Which type of neural network is typically used for image recognition?",
        expected: ["cnn", "rnn", "dnn", "ann"],
        options: [
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)",
            "Deep Neural Networks (DNNs)",
            "Artificial Neural Networks (ANNs)"
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Convolutional Neural Networks (CNNs) are typically used for image recognition due to their ability to process spatial hierarchies."
    },
    {
        domain: "Machine Learning",
        text: "What does 'data augmentation' refer to?",
        expected: ["enhancement", "training", "images", "examples"],
        options: [
            "Creating new features from existing ones",
            "Enhancing training data by creating modified versions of existing data",
            "Reducing the size of the dataset",
            "The process of selecting the most important features"
        ],
        correctOption: 1,
        isMockQuestion: true,
        answer: "Data augmentation refers to enhancing training data by creating modified versions of existing data, often used in image processing."
    },
    {
        domain: "Machine Learning",
        text: "Which is the difference between classification and regression?",
        expected: ["types", "output", "values", "data"],
        options: [
            "Classification predicts categorical outputs, while regression predicts continuous outputs.",
            "Classification uses numerical data only, while regression uses categorical data.",
            "Classification is always supervised, while regression can be unsupervised.",
            "There is no difference; they are interchangeable terms."
        ],
        correctOption: 0,
        isMockQuestion: true,
        answer: "Classification predicts categorical outputs, while regression predicts continuous outputs based on input features."
    },
  //DevOps Engineering 
  {
    domain: "DevOps Engineering",
    text: "What is DevOps?",
    expected: ["development", "operations", "collaboration", "culture"],
    options: [
        "A set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle",
        "A programming framework",
        "A type of cloud service",
        "A version control tool"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops) to shorten the development lifecycle."
},
{
    domain: "DevOps Engineering",
    text: "What is Continuous Integration (CI)?",
    expected: ["automation", "testing", "integration", "software"],
    options: [
        "The practice of automatically testing and merging code changes frequently into a shared repository",
        "A method of deploying applications",
        "A project management framework",
        "A type of programming language"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Continuous Integration (CI) is the practice of automatically testing and merging code changes frequently into a shared repository."
},
{
    domain: "DevOps Engineering",
    text: "What is Continuous Deployment (CD)?",
    expected: ["automation", "deployment", "code", "production"],
    options: [
        "Automating the release of software to production environments after passing tests",
        "A data backup strategy",
        "A method of code review",
        "The process of software development"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Continuous Deployment (CD) involves automating the release of software to production environments after passing tests."
},
{
    domain: "DevOps Engineering",
    text: "What is infrastructure as code (IaC)?",
    expected: ["provision", "management", "infrastructure", "code"],
    options: [
        "Managing and provisioning infrastructure through code to automate setup operations and environments",
        "A programming language for infrastructure management",
        "A type of cloud service",
        "A security protocol"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Infrastructure as Code (IaC) is managing and provisioning infrastructure through code to automate setup operations and environments."
},
{
    domain: "DevOps Engineering",
    text: "What is a version control system?",
    expected: ["track", "changes", "collaboration", "code"],
    options: [
        "A tool that allows developers to track changes in code and collaborate on projects",
        "A method of deploying applications",
        "A security feature",
        "A type of database"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A version control system is a tool that allows developers to track changes in code and collaborate on projects."
},
{
    domain: "DevOps Engineering",
    text: "What is containerization?",
    expected: ["virtualization", "applications", "environments", "lightweight"],
    options: [
        "Encapsulating applications and their dependencies in containers to ensure consistency across environments",
        "A method of securing data",
        "A type of database management",
        "A server management technique"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Containerization involves encapsulating applications and their dependencies in containers to ensure consistency across environments."
},
{
    domain: "DevOps Engineering",
    text: "What is a microservices architecture?",
    expected: ["services", "architecture", "independent", "applications"],
    options: [
        "An architectural style that structures an application as a collection of loosely coupled, independently deployable services",
        "A type of database architecture",
        "A networking model",
        "An API standard"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Microservices architecture is an architectural style that structures an application as a collection of loosely coupled, independently deployable services."
},
{
    domain: "DevOps Engineering",
    text: "What is configuration management?",
    expected: ["automation", "system", "configuration", "settings"],
    options: [
        "The process of managing and automating the configuration of systems and software environments",
        "A software development methodology",
        "An application testing process",
        "A security protocol"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Configuration management is the process of managing and automating the configuration of systems and software environments."
},
{
    domain: "DevOps Engineering",
    text: "What is monitoring in DevOps?",
    expected: ["observability", "systems", "performance", "applications"],
    options: [
        "The practice of continuously observing and analyzing systems and applications to ensure performance and reliability",
        "A data backup process",
        "A method of writing code",
        "A form of user testing"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Monitoring in DevOps is the practice of continuously observing and analyzing systems and applications to ensure performance and reliability."
},
{
    domain: "DevOps Engineering",
    text: "What is a build pipeline?",
    expected: ["automation", "process", "software", "compile"],
    options: [
        "An automated process that compiles, tests, and deploys code changes to production",
        "A manual deployment process",
        "A database configuration",
        "A type of programming language"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A build pipeline is an automated process that compiles, tests, and deploys code changes to production."
},
{
    domain: "DevOps Engineering",
    text: "What does CI/CD stand for?",
    expected: ["continuous", "integration", "delivery", "deployment"],
    options: [
        "Continuous Integration/Continuous Deployment, a combined approach for automating software delivery",
        "Compiling Integration/Code Delivery",
        "Control Interface/Control Deployment",
        "Configuration Integration/Cloud Delivery"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "CI/CD stands for Continuous Integration/Continuous Deployment, a combined approach for automating software delivery."
},
{
    domain: "DevOps Engineering",
    text: "What is a release manager?",
    expected: ["software", "planning", "management", "environment"],
    options: [
        "A role responsible for ensuring that software releases are coordinated and delivered on time and within scope",
        "A type of project management tool",
        "A dedicated software application",
        "A testing framework"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A release manager is responsible for ensuring that software releases are coordinated and delivered on time and within scope."
},
{
    domain: "DevOps Engineering",
    text: "What is Agile methodology?",
    expected: ["iterative", "development", "process", "collaboration"],
    options: [
        "An iterative and incremental approach to software development that emphasizes collaboration and flexibility",
        "A version control tool",
        "A database management technique",
        "A hardware configuration"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Agile methodology is an iterative and incremental approach to software development that emphasizes collaboration and flexibility."
},
{
    domain: "DevOps Engineering",
    text: "What is a rollback?",
    expected: ["version", "previous", "change", "deployment"],
    options: [
        "The process of reverting to a previous version of software after a failed deployment",
        "A security measure",
        "A backup process",
        "An update method"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A rollback is the process of reverting to a previous version of software after a failed deployment."
},
{
    domain: "DevOps Engineering",
    text: "What is a Cloud Service?",
    expected: ["computing", "on-demand", "resources", "internet"],
    options: [
        "On-demand computing resources and services delivered over the internet",
        "A type of data storage",
        "A programming platform",
        "A management tool"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A Cloud Service refers to on-demand computing resources and services delivered over the internet."
},
{
    domain: "DevOps Engineering",
    text: "What is a DevOps toolchain?",
    expected: ["set", "tools", "devops", "process"],
    options: [
        "A set of tools used to implement DevOps practices throughout the software development lifecycle",
        "A networking protocol",
        "A security framework",
        "A programming language suite"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A DevOps toolchain is a set of tools used to implement DevOps practices throughout the software development lifecycle."
},
{
    domain: "DevOps Engineering",
    text: "What is a dependency in software development?",
    expected: ["software", "component", "requirement", "library"],
    options: [
        "A software component or library that a project requires in order to run",
        "A type of project management method",
        "A network protocol",
        "A code optimization technique"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "A dependency is a software component or library that a project requires in order to run."
},
{
    domain: "DevOps Engineering",
    text: "What is Git?",
    expected: ["version", "control", "system", "software"],
    options: [
        "A distributed version control system for tracking changes in source code during software development",
        "A programming language",
        "A database management tool",
        "A monitoring service"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "Git is a distributed version control system for tracking changes in source code during software development."
},
{
    domain: "DevOps Engineering",
    text: "What does 'shift left' mean in DevOps?",
    expected: ["testing", "early", "process", "development"],
    options: [
        "An approach that promotes addressing issues such as testing and security earlier in the development process",
        "A deployment strategy",
        "A version control method",
        "A type of coding style"
    ],
    correctOption: 0,
    isMockQuestion: true,
    answer: "'Shift left' refers to addressing issues like testing and security earlier in the development process."
},
//System Administration 

  {
      domain: "System Administration",
      text: "What is the primary role of a system administrator?",
      expected: ["maintenance", "installation", "network", "servers"],
      options: [
          "To manage database structures",
          "To install and maintain software and hardware",
          "To write application code",
          "To develop web pages"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The primary role of a system administrator is to install and maintain software and hardware systems, ensuring optimal system performance."
  },
  {
      domain: "System Administration",
      text: "Which command is used to list files and directories in UNIX/Linux?",
      expected: ["ls", "dir", "list", "show"],
      options: [
          "ls",
          "dir",
          "list",
          "show"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "The 'ls' command is used to list files and directories in UNIX/Linux systems."
  },
  {
      domain: "System Administration",
      text: "What does the acronym 'DNS' stand for?",
      expected: ["system", "name", "domain", "resolution"],
      options: [
          "Domain Name System",
          "Dynamic Network System",
          "Data Network Service",
          "Domain Navigation Service"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "DNS stands for Domain Name System, which translates domain names into IP addresses."
  },
  {
      domain: "System Administration",
      text: "What is the purpose of a firewall?",
      expected: ["filtering", "security", "traffic", "monitoring"],
      options: [
          "To manage user accounts",
          "To filter and control incoming and outgoing network traffic",
          "To enhance graphics performance",
          "To optimize disk space"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "A firewall's purpose is to filter and control incoming and outgoing network traffic, enhancing security."
  },
  {
      domain: "System Administration",
      text: "Which protocol is commonly used for secure data transfer over the internet?",
      expected: ["ssh", "ftp", "http", "telnet"],
      options: [
          "FTP",
          "HTTP",
          "SSH",
          "Telnet"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "SSH (Secure Shell) is commonly used for secure data transfer and remote access over the internet."
  },
  {
      domain: "System Administration",
      text: "What does RAID stand for?",
      expected: ["redundant", "array", "independent", "disks"],
      options: [
          "Rapid Access Independent Disk",
          "Redundant Array of Independent Disks",
          "Redundant Access Interface Disk",
          "Reliable Array of Integrated Disks"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "RAID stands for Redundant Array of Independent Disks, which is a technology used to combine multiple hard drives for redundancy and performance."
  },
  {
      domain: "System Administration",
      text: "Which service is responsible for managing IP addresses within a network?",
      expected: ["dhcp", "dns", "http", "smtp"],
      options: [
          "DNS (Domain Name System)",
          "HTTP (Hypertext Transfer Protocol)",
          "DHCP (Dynamic Host Configuration Protocol)",
          "SMTP (Simple Mail Transfer Protocol)"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "DHCP (Dynamic Host Configuration Protocol) is responsible for automatically managing and assigning IP addresses within a network."
  },
  {
      domain: "System Administration",
      text: "What does the command 'chmod' do in a UNIX/Linux environment?",
      expected: ["permissions", "files", "change", "mode"],
      options: [
          "Displays file contents",
          "Changes file permissions",
          "Copies files",
          "Moves files to another location"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The 'chmod' command is used in UNIX/Linux to change file permissions for users, groups, and others."
  },
  {
      domain: "System Administration",
      text: "What is the purpose of system monitoring tools?",
      expected: ["performance", "resources", "usage", "management"],
      options: [
          "To increase power consumption",
          "To monitor system performance and resource usage",
          "To create backups",
          "To install software updates"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "System monitoring tools are used to monitor system performance and resource usage, helping administrators maintain efficiency."
  },
  {
      domain: "System Administration",
      text: "Which of the following is a popular configuration management tool?",
      expected: ["ansible", "notepad", "excel", "word"],
      options: [
          "Ansible",
          "Photoshop",
          "Visual Studio",
          "PowerPoint"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Ansible is a popular configuration management tool used to automate system configuration and deployment."
  },
  {
      domain: "System Administration",
      text: "What is the primary function of a proxy server?",
      expected: ["intermediary", "requests", "management", "connections"],
      options: [
          "To block unwanted traffic",
          "To serve cached web pages",
          "To act as an intermediary for requests from clients seeking resources from other servers",
          "To manage user permissions"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "A proxy server acts as an intermediary for requests from clients seeking resources from other servers, often providing added security or caching."
  },
  {
      domain: "System Administration",
      text: "Which command is used to display current network connections on a Windows system?",
      expected: ["netstat", "status", "connections", "ipconfig"],
      options: [
          "ping",
          "ipconfig",
          "netstat",
          "route"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "The 'netstat' command is used to display current network connections and statistics on a Windows system."
  },
  {
      domain: "System Administration",
      text: "What is the purpose of a VPN (Virtual Private Network)?",
      expected: ["secure", "connection", "network", "internet"],
      options: [
          "To access restricted websites",
          "To encrypt the user's internet connection and provide a secure tunnel over the internet",
          "To speed up internet connections",
          "To avoid network security measures"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "A VPN (Virtual Private Network) encrypts the user's internet connection and provides a secure tunnel over the internet, improving privacy."
  },
  {
      domain: "System Administration",
      text: "Which operating system is known for being open-source?",
      expected: ["linux", "windows", "macos", "unix"],
      options: [
          "Windows",
          "MacOS",
          "Linux",
          "Unix"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "Linux is known for being open-source, allowing users to view and modify the source code."
  },
  {
      domain: "System Administration",
      text: "What is the primary use of the command 'ping'?",
      expected: ["network", "connectivity", "test", "host"],
      options: [
          "To test the network connectivity between two hosts",
          "To download files from the internet",
          "To display the files in a directory",
          "To create network shares"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "The 'ping' command is primarily used to test the network connectivity between two hosts, checking if a host is reachable."
  },
  {
      domain: "System Administration",
      text: "Which file system is commonly used in Windows operating systems?",
      expected: ["ntfs", "ext4", "apfs", "fat32"],
      options: [
          "NTFS",
          "EXT4",
          "APFS",
          "FAT32"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "NTFS (New Technology File System) is commonly used in Windows operating systems due to its features such as file permissions and encryption."
  },
  {
      domain: "System Administration",
      text: "What does 'SSH' stand for?",
      expected: ["secure", "shell", "protocol", "access"],
      options: [
          "Secure Socket Hosting",
          "Simple Shell Host",
          "Secure Shell",
          "Socket Shell Host"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "SSH stands for Secure Shell, a protocol used for securely accessing remote servers over a network."
  },
  {
      domain: "System Administration",
      text: "What is the primary purpose of system backups?",
      expected: ["data", "recovery", "protection", "access"],
      options: [
          "To enhance performance",
          "To provide an additional layer of security",
          "To safeguard data and ensure recovery in case of data loss",
          "To create system logs"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "The primary purpose of system backups is to safeguard data and ensure recovery in case of data loss or corruption."
  },
  {
      domain: "System Administration",
      text: "What does the term 'script' refer to in system administration?",
      expected: ["code", "commands", "automation", "task"],
      options: [
          "A written document",
          "A series of commands that automate tasks",
          "A program that only runs on Windows",
          "An audio file"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "A 'script' refers to a series of commands that automate tasks in system administration, allowing processes to run without manual intervention."
  },
  {
      domain: "System Administration",
      text: "What tool is commonly used for monitoring system performance?",
      expected: ["top", "editor", "compiler", "client"],
      options: [
          "Notepad",
          "top (Linux)",
          "Visual Studio",
          "Google Chrome"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The 'top' command in Linux is commonly used for monitoring system performance, providing a real-time view of resource usage."
  },
  {
      domain: "System Administration",
      text: "Which of the following is a common file transfer protocol?",
      expected: ["ftp", "smtp", "http", "pop3"],
      options: [
          "FTP (File Transfer Protocol)",
          "SMTP (Simple Mail Transfer Protocol)",
          "HTTP (Hypertext Transfer Protocol)",
          "POP3 (Post Office Protocol)"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "FTP (File Transfer Protocol) is a common protocol used for transferring files between computers over a network."
  },
  {
      domain: "System Administration",
      text: "What does the acronym 'SLI' stand for in graphical system settings?",
      expected: ["scalable", "link", "interface", "multi"],
      options: [
          "Single Link Interface",
          "Scalable Link Interface",
          "Super Link Integration",
          "Systems Link Interface"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "SLI stands for Scalable Link Interface, which allows multiple graphics cards to work together to improve rendering performance."
  },

//Business Analytics 
{
  domain: "Business Analytics",
  text: "What is business analytics?",
  expected: ["data", "analysis", "decision", "business"],
  options: [
      "The practice of using data analysis and statistical methods to make informed business decisions",
      "The process of manufacturing goods",
      "A financial forecasting method",
      "A type of market research"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Business analytics is the practice of using data analysis and statistical methods to make informed business decisions."
},
{
  domain: "Business Analytics",
  text: "What is descriptive analytics?",
  expected: ["historical", "data", "analysis", "trends"],
  options: [
      "The analysis of historical data to identify trends and patterns",
      "Predicting future trends based on current data",
      "Creating complex statistical models",
      "Analyzing individual transactions"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Descriptive analytics involves analyzing historical data to identify trends and patterns."
},
{
  domain: "Business Analytics",
  text: "What is predictive analytics?",
  expected: ["future", "behavior", "models", "analysis"],
  options: [
      "The use of statistical models and machine learning techniques to predict future outcomes based on historical data",
      "Analyzing past sales data only",
      "A method of financial reporting",
      "A type of data visualization"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Predictive analytics uses statistical models and machine learning techniques to predict future outcomes based on historical data."
},
{
  domain: "Business Analytics",
  text: "What is prescriptive analytics?",
  expected: ["recommendations", "decision", "analysis", "solutions"],
  options: [
      "The analysis that provides recommendations for decision-making based on predictive analytics",
      "A method of reporting financial data",
      "Creating data entry forms",
      "A type of data governance"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Prescriptive analytics provides recommendations for decision-making based on insights from predictive analytics."
},
{
  domain: "Business Analytics",
  text: "What is a data-driven decision?",
  expected: ["evidence", "data", "choices", "analysis"],
  options: [
      "A decision made based on data analysis and insights rather than intuition or experience",
      "A decision without any data",
      "A form of qualitative analysis",
      "A traditional management decision"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A data-driven decision is made based on data analysis and insights rather than intuition or experience."
},
{
  domain: "Business Analytics",
  text: "What is a key performance indicator (KPI)?",
  expected: ["measure", "performance", "success", "objectives"],
  options: [
      "A measurable value that demonstrates how effectively a company is achieving key business objectives",
      "A form of data collection",
      "A market research tool",
      "A type of financial statement"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A key performance indicator (KPI) is a measurable value that demonstrates how effectively a company is achieving key business objectives."
},
{
  domain: "Business Analytics",
  text: "What is data visualization?",
  expected: ["graphical", "representation", "data", "insights"],
  options: [
      "The graphical representation of information and data to help stakeholders understand insights",
      "The process of cleaning data",
      "A type of data storage",
      "A method for data entry"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Data visualization is the graphical representation of information and data to help stakeholders understand insights."
},
{
  domain: "Business Analytics",
  text: "What tools are commonly used for business analytics?",
  expected: ["software", "tools", "analysis", "data"],
  options: [
      "Business intelligence software like Tableau, Power BI, and Google Analytics",
      "Hardware for data storage",
      "Social media platforms",
      "A type of programming language"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Common tools for business analytics include business intelligence software like Tableau, Power BI, and Google Analytics."
},
{
  domain: "Business Analytics",
  text: "What is data mining?",
  expected: ["patterns", "insights", "analysis", "data"],
  options: [
      "The process of discovering patterns and insights in large sets of data using various techniques",
      "A type of data storage",
      "Data collection from surveys",
      "A method for data entry"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Data mining is the process of discovering patterns and insights in large sets of data using various techniques."
},
{
  domain: "Business Analytics",
  text: "What is a business intelligence (BI) system?",
  expected: ["data", "technology", "business", "insights"],
  options: [
      "A technology that collects, stores, and analyzes data to help professionals make informed business decisions",
      "A financial reporting tool",
      "A human resources management system",
      "A method of project management"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A business intelligence (BI) system is a technology that collects, stores, and analyzes data to help professionals make informed business decisions."
},
{
  domain: "Business Analytics",
  text: "What is A/B testing?",
  expected: ["experiment", "comparison", "data", "versions"],
  options: [
      "An experiment that compares two versions of a webpage or product to determine which performs better",
      "A form of data cleaning",
      "A type of financial analysis",
      "A software testing process"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A/B testing is an experiment that compares two versions of a webpage or product to determine which performs better."
},
{
  domain: "Business Analytics",
  text: "What is customer segmentation?",
  expected: ["groups", "customers", "characteristics", "analysis"],
  options: [
      "The process of dividing customers into groups based on shared characteristics for targeted marketing",
      "A financial assessment method",
      "A type of data encryption",
      "A programming practice"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Customer segmentation is the process of dividing customers into groups based on shared characteristics for targeted marketing."
},
{
  domain: "Business Analytics",
  text: "What are dashboards in business analytics?",
  expected: ["visualization", "overview", "data", "KPIs"],
  options: [
      "Visual representations of data that provide an overview of key performance indicators (KPIs) and metrics",
      "A form of data storage",
      "A type of report",
      "A programming tool"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Dashboards in business analytics are visual representations of data that provide an overview of key performance indicators (KPIs) and metrics."
},
{
  domain: "Business Analytics",
  text: "What is the role of a business analyst?",
  expected: ["analysis", "business", "solutions", "requirements"],
  options: [
      "To analyze business needs, identify solutions, and help improve processes within organizations",
      "To develop software applications",
      "To manage financial resources",
      "To conduct market research exclusively"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The role of a business analyst is to analyze business needs, identify solutions, and help improve processes within organizations."
},
{
  domain: "Business Analytics",
  text: "What does KPI monitoring involve?",
  expected: ["tracking", "performance", "metrics", "objectives"],
  options: [
      "Regularly tracking and assessing key performance indicators to evaluate progress toward objectives",
      "Data collection for sales",
      "Conducting user surveys",
      "Financial auditing"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "KPI monitoring involves regularly tracking and assessing key performance indicators to evaluate progress toward objectives."
},
{
  domain: "Business Analytics",
  text: "What is a hypothesis in analytics?",
  expected: ["statement", "assumption", "testable", "research"],
  options: [
      "A testable statement made based on observations that can be proven or disproven through analysis",
      "A type of data collection method",
      "A statistical model",
      "A financial projection"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "In analytics, a hypothesis is a testable statement made based on observations that can be proven or disproven through analysis."
},
{
  domain: "Business Analytics",
  text: "What is a market basket analysis?",
  expected: ["purchases", "consumer", "items", "patterns"],
  options: [
      "A technique used to understand the purchase behavior of consumers by analyzing items that are frequently bought together",
      "A method for inventory management",
      "A way to categorize products",
      "A financial analysis tool"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Market basket analysis is a technique used to understand consumer purchase behavior by analyzing items that are frequently bought together."
},
{
  domain: "Business Analytics",
  text: "What is time series analysis?",
  expected: ["data", "trends", "time", "forecasting"],
  options: [
      "A method of analyzing data points collected or recorded at specific time intervals to identify trends over time",
      "A financial forecasting method",
      "A security analysis technique",
      "A project management tool"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Time series analysis is a method of analyzing data points collected or recorded at specific time intervals to identify trends over time."
},
{
  domain: "Business Analytics",
  text: "What is data governance?",
  expected: ["management", "data", "policies", "quality"],
  options: [
      "The management of data availability, usability, integrity, and security in an organization through established policies",
      "A type of data storage",
      "A programming practice",
      "A statistical method"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Data governance is the management of data availability, usability, integrity, and security in an organization through established policies."
},
//QA Engineering 

  {
      domain: "QA Engineering",
      text: "What is the primary goal of QA (Quality Assurance) in software development?",
      expected: ["quality", "process", "standards", "testing"],
      options: [
          "To establish coding standards",
          "To ensure product quality throughout the development process",
          "To eliminate all bugs before release",
          "To document all changes made in the software"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The primary goal of QA in software development is to ensure product quality throughout the development process, not just by testing but also by improving processes."
  },
  {
      domain: "QA Engineering",
      text: "What does the term 'test case' refer to?",
      expected: ["conditions", "inputs", "outputs", "validation"],
      options: [
          "A scenario that describes the specifics of an aspect to be tested",
          "A set of guidelines for writing test scripts",
          "The configuration of the testing environment",
          "The expected outcome of the software"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "A test case refers to a scenario that describes the specifics of an aspect to be tested, including inputs and expected outcomes."
  },
  {
      domain: "QA Engineering",
      text: "Which of the following is an example of functional testing?",
      expected: ["ui", "unit", "integration", "acceptance"],
      options: [
          "Performance Testing",
          "Unit Testing",
          "Integration Testing",
          "Usability Testing"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "Integration Testing is an example of functional testing, as it verifies that different modules or services in an application work together as expected."
  },
  {
      domain: "QA Engineering",
      text: "What is the purpose of regression testing?",
      expected: ["changes", "new", "features", "bugs"],
      options: [
          "To ensure new features do not break existing functionality",
          "To load test the application",
          "To evaluate user experience",
          "To validate the deployment environment"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "The purpose of regression testing is to ensure that new features or changes do not break existing functionality within the application."
  },
  {
      domain: "QA Engineering",
      text: "What is an automated test script?",
      expected: ["predefined", "execution", "manual", "process"],
      options: [
          "A manual procedure for testing software",
          "A script that executes test cases automatically without manual intervention",
          "A report detailing previous test results",
          "A plan for future testing processes"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "An automated test script is a script that executes test cases automatically without manual intervention, increasing efficiency in testing."
  },
  {
      domain: "QA Engineering",
      text: "Which testing technique is primarily used for identifying bugs in the software?",
      expected: ["static", "dynamic", "manual", "performance"],
      options: [
          "Static Testing",
          "Dynamic Testing",
          "Regression Testing",
          "Usability Testing"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "Dynamic Testing is primarily used for identifying bugs in the software by executing the code and observing the program behavior."
  },
  {
      domain: "QA Engineering",
      text: "What does the acronym 'BDD' stand for in testing?",
      expected: ["behavior", "driven", "development", "all"],
      options: [
          "Behavior Development Documentation",
          "Behavior Driven Development",
          "Built in Development Debugging",
          "Binary Data Driven"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "BDD stands for Behavior Driven Development, a software development approach that emphasizes collaboration between developers, QA, and non-technical stakeholders."
  },
  {
      domain: "QA Engineering",
      text: "What is the purpose of performance testing?",
      expected: ["speed", "scalability", "reliability", "all"],
      options: [
          "To assess the reliability of the software",
          "To improve the user interface",
          "To evaluate how the application performs under load",
          "To validate the integration of various components"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "The purpose of performance testing is to evaluate how the application performs under load, including response times and stability."
  },
  {
      domain: "QA Engineering",
      text: "Which of the following is a common test management tool?",
      expected: ["jira", "photoshop", "sql", "html"],
      options: [
          "Jira",
          "Microsoft Word",
          "Photoshop",
          "SQL"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Jira is a common test management tool that helps teams track and manage software testing tasks and issues."
  },
  {
      domain: "QA Engineering",
      text: "What is exploratory testing?",
      expected: ["unscripted", "manual", "testing", "knowledge"],
      options: [
          "A testing approach that relies on scripted test cases",
          "Dynamic testing without a formal test plan, focusing on tester creativity and knowledge",
          "Testing with predefined scenarios only",
          "A technique used for performance testing"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "Exploratory testing is a dynamic testing approach that relies on tester creativity and knowledge without a formal test plan, allowing for flexibility."
  },
  {
      domain: "QA Engineering",
      text: "What is the purpose of user acceptance testing (UAT)?",
      expected: ["validation", "end-users", "requirements", "stakeholders"],
      options: [
          "To test the software on staging environments",
          "To ensure the software meets business requirements from end-users' perspective",
          "To check regression in the application after deployment",
          "To perform security checks"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "User Acceptance Testing (UAT) is conducted to ensure the software meets business requirements from the perspective of end-users before the final release."
  },
  {
      domain: "QA Engineering",
      text: "Which of the following tools is commonly used for performance testing?",
      expected: ["jmeter", "pspad", "vim", "mysql"],
      options: [
          "JMeter",
          "Notepad",
          "Vim",
          "Visual Studio"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "JMeter is commonly used for performance testing to simulate load and measure application performance under various conditions."
  },
  {
      domain: "QA Engineering",
      text: "What is a smoke test?",
      expected: ["basic", "checks", "functional", "acceptance"],
      options: [
          "A detailed test of all functionalities",
          "A quick check to see if the core functionalities work after a build",
          "A test performed by end users",
          "A performance-related evaluation"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "A smoke test is a quick check to see if the core functionalities of the application work after a new build or deployment."
  },
  {
      domain: "QA Engineering",
      text: "Which methodology emphasizes continuous improvement and collaboration between teams?",
      expected: ["agile", "waterfall", "traditional", "linear"],
      options: [
          "Agile",
          "Waterfall",
          "V-Model",
          "Spiral Model"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Agile methodology emphasizes continuous improvement and collaboration between teams, allowing for flexible responses to change."
  },
  {
      domain: "QA Engineering",
      text: "What is the role of a test automation engineer?",
      expected: ["scripting", "testing", "automate", "process"],
      options: [
          "To manually test software applications",
          "To create and maintain automated test scripts to improve testing efficiency",
          "To manage the development team",
          "To design user interfaces"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "A test automation engineer creates and maintains automated test scripts to improve testing efficiency and reduce human error."
  },
  {
      domain: "QA Engineering",
      text: "What does a bug report typically include?",
      expected: ["description", "summary", "expected", "all"],
      options: [
          "Summary and description of the issue",
          "Steps to reproduce the issue",
          "Expected and actual results",
          "All of the Above"
      ],
      correctOption: 3,
      isMockQuestion: true,
      answer: "A bug report typically includes a summary, description of the issue, steps to reproduce it, and the expected and actual results."
  },
  {
      domain: "QA Engineering",
      text: "What does 'Test-Driven Development' (TDD) emphasize?",
      expected: ["testing", "unit", "development", "coding"],
      options: [
          "Writing tests before writing code",
          "Documenting testing procedures",
          "Feeding user requirements into test plans",
          "Creating user documentation"
      ],
      correctOption: 0,
      isMockQuestion: true,
      answer: "Test-Driven Development emphasizes writing tests before writing the actual code, ensuring that the software meets its requirements from the start."
  },
  {
      domain: "QA Engineering",
      text: "What is the purpose of integration testing?",
      expected: ["components", "overall", "system", "features"],
      options: [
          "To test individual components in isolation",
          "To evaluate the performance of the overall system",
          "To test combined parts of an application to check if they work together properly",
          "To validate user acceptance"
      ],
      correctOption: 2,
      isMockQuestion: true,
      answer: "Integration testing aims to test combined parts of an application to check if they work together properly."
  },
  {
      domain: "QA Engineering",
      text: "What is the difference between black-box testing and white-box testing?",
      expected: ["internal", "external", "view", "knowledge"],
      options: [
          "Black-box testing focuses on internal structures while white-box testing focuses on external behaviors",
          "Black-box testing does not require knowledge of internal code, while white-box testing does",
          "There is no difference; they are the same",
          "Only white-box testing requires a testing tool"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The difference is that black-box testing does not require knowledge of internal code, while white-box testing requires understanding of the internal workings of the application."
  },
  {
      domain: "QA Engineering",
      text: "What is the significance of the 'defect life cycle'?",
      expected: ["tracking", "management", "stages", "resolution"],
      options: [
          "To document user stories",
          "To outline the stages of a defect from discovery to closure",
          "To perform testing procedures",
          "To allocate resources effectively"
      ],
      correctOption: 1,
      isMockQuestion: true,
      answer: "The 'defect life cycle' outlines the stages of a defect from discovery to closure, helping teams manage defects effectively."
  },

//Embedded Systems 
{
  domain: "Embedded Systems",
  text: "What is an embedded system?",
  expected: ["computer", "application", "specific", "control"],
  options: [
      "A computer system designed for specific applications within a larger device",
      "A general-purpose computer",
      "A type of network protocol",
      "A server system"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "An embedded system is a computer system designed for specific applications within a larger device."
},
{
  domain: "Embedded Systems",
  text: "What are microcontrollers?",
  expected: ["integrated", "circuit", "controllers", "embedded"],
  options: [
      "Small computing devices with a processor, memory, and input/output peripherals integrated into one chip",
      "Large processing units used in desktops",
      "Analog signal processors",
      "High-performance computing systems"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Microcontrollers are small computing devices with a processor, memory, and input/output peripherals integrated into one chip."
},
{
  domain: "Embedded Systems",
  text: "What is the main purpose of an embedded system?",
  expected: ["specific", "task", "dedicated", "control"],
  options: [
      "To perform a specific task or function within a larger system or device",
      "To operate as a general-purpose computer",
      "To manage networks",
      "To provide user interfaces"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The main purpose of an embedded system is to perform a specific task or function within a larger system or device."
},
{
  domain: "Embedded Systems",
  text: "What is real-time operating system (RTOS)?",
  expected: ["operating", "system", "timing", "applications"],
  options: [
      "An operating system that guarantees response to events within strict time constraints",
      "A type of file management system",
      "A network operating system",
      "A database management system"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A real-time operating system (RTOS) is an operating system that guarantees response to events within strict time constraints."
},
{
  domain: "Embedded Systems",
  text: "What is the function of an embedded software?",
  expected: ["control", "hardware", "operate", "application"],
  options: [
      "To control and manage the hardware components of an embedded system",
      "To provide a user interface",
      "To encrypt data",
      "To connect to the internet"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Embedded software is responsible for controlling and managing the hardware components of an embedded system."
},
{
  domain: "Embedded Systems",
  text: "What are sensors in embedded systems?",
  expected: ["measure", "environment", "data", "physical"],
  options: [
      "Devices that measure physical properties and convert them into signals that can be interpreted",
      "Communication devices",
      "Output devices",
      "Memory storage devices"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Sensors in embedded systems are devices that measure physical properties and convert them into signals that can be interpreted."
},
{
  domain: "Embedded Systems",
  text: "What are actuators used for in embedded systems?",
  expected: ["perform", "action", "mechanical", "response"],
  options: [
      "Devices that perform an action or cause movement in response to a signal from the embedded system",
      "Data collection tools",
      "Processing units",
      "Input devices"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Actuators are devices that perform an action or cause movement in response to a signal from the embedded system."
},
{
  domain: "Embedded Systems",
  text: "What is a bootloader?",
  expected: ["software", "initializes", "system", "process"],
  options: [
      "A small program that initializes the hardware and loads the main application software in embedded systems",
      "An operating system",
      "A utility for managing files",
      "A type of user interface"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A bootloader is a small program that initializes the hardware and loads the main application software in embedded systems."
},
{
  domain: "Embedded Systems",
  text: "What is the importance of power management in embedded systems?",
  expected: ["efficiency", "performance", "energy", "usage"],
  options: [
      "To maximize energy efficiency and extend battery life in portable devices",
      "To improve computational performance",
      "To increase data storage",
      "To enhance user interfaces"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Power management in embedded systems is important for maximizing energy efficiency and extending battery life in portable devices."
},
{
  domain: "Embedded Systems",
  text: "What is the role of the communication protocol in embedded systems?",
  expected: ["data", "transfer", "control", "modules"],
  options: [
      "To define rules for data exchange between different parts of the embedded system or between systems",
      "To manage power consumption",
      "To enhance graphics performance",
      "To optimize memory usage"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The communication protocol defines the rules for data exchange between different parts of the embedded system or between systems."
},
{
  domain: "Embedded Systems",
  text: "What types of programming languages are typically used in embedded systems development?",
  expected: ["C", "Assembly", "languages", "development"],
  options: [
      "Languages like C, C++, and Assembly that provide low-level control over hardware",
      "Only high-level scripting languages",
      "Data visualization tools",
      "Web development frameworks"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Embedded systems development typically uses programming languages like C, C++, and Assembly that provide low-level control over hardware."
},
{
  domain: "Embedded Systems",
  text: "What is hardware abstraction?",
  expected: ["layers", "hardware", "software", "interfaces"],
  options: [
      "The use of software interfaces to hide the complexities of hardware interactions from higher-level software",
      "A type of device management",
      "A programming technique",
      "A network communication method"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Hardware abstraction is the use of software interfaces to hide the complexities of hardware interactions from higher-level software."
},
{
  domain: "Embedded Systems",
  text: "What does 'static memory allocation' refer to?",
  expected: ["fixed", "memory", "allocation", "at compile"],
  options: [
      "Allocating memory at compile time, resulting in fixed memory size during program execution",
      "Dynamic memory allocation based on user input",
      "Memory allocation managed by the operating system",
      "A method for optimizing memory usage in runtime"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Static memory allocation refers to allocating memory at compile time, resulting in fixed memory size during program execution."
},
{
  domain: "Embedded Systems",
  text: "What is 'firmware' in embedded systems?",
  expected: ["software", "hardware", "specific", "devices"],
  options: [
      "Software programmed into a hardware device that controls its functions at a low level",
      "An operating system",
      "A database management tool",
      "A type of mobile application"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Firmware is software programmed into a hardware device that controls its functions at a low level."
},
{
  domain: "Embedded Systems",
  text: "What is an evaluation board?",
  expected: ["development", "board", "prototype", "system"],
  options: [
      "A hardware platform used for developing and testing embedded systems before production",
      "A type of circuit board",
      "A data storage device",
      "A user interface"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "An evaluation board is a hardware platform used for developing and testing embedded systems before production."
},
{
  domain: "Embedded Systems",
  text: "What is GPIO?",
  expected: ["general", "purpose", "input", "output"],
  options: [
      "General Purpose Input/Output, a type of pin on a microcontroller used for interfacing with peripherals",
      "A communication protocol",
      "A type of sensor",
      "An operating system function"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "GPIO stands for General Purpose Input/Output, which are pins on a microcontroller used for interfacing with peripherals."
},
{
  domain: "Embedded Systems",
  text: "What is the purpose of debugging in embedded systems?",
  expected: ["errors", "identify", "fix", "issues"],
  options: [
      "To identify and fix errors or bugs in the software running on the embedded system",
      "To optimize hardware performance",
      "To manage data storage",
      "To enhance user experience"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The purpose of debugging in embedded systems is to identify and fix errors or bugs in the software running on the embedded system."
},
{
  domain: "Embedded Systems",
  text: "What does 'booting' refer to in embedded systems?",
  expected: ["initialization", "system", "startup", "hardware"],
  options: [
      "The process of starting up the embedded system where it initializes hardware and loads firmware",
      "Data backup",
      "Power management",
      "Memory allocation"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Booting in embedded systems refers to the process of starting up the embedded system, where it initializes hardware and loads firmware."
},
{
  domain: "Embedded Systems",
  text: "What is the role of a debugger?",
  expected: ["identify", "fix", "analyze", "software"],
  options: [
      "A tool used to analyze code and identify issues during the development of embedded software",
      "A programming language",
      "A hardware component",
      "A type of user interface"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A debugger is a tool used to analyze code and identify issues during the development of embedded software."
},

//Web Development 
{
  domain: "Web Development",
  text: "What is the primary language used for structuring content on the web?",
  expected: ["HTML", "Hypertext", "Markup", "Language"],
  options: [
      "HTML (Hypertext Markup Language)",
      "CSS (Cascading Style Sheets)",
      "JavaScript",
      "PHP (Hypertext Preprocessor)"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "HTML (Hypertext Markup Language) is the primary language used for structuring content on the web."
},
{
  domain: "Web Development",
  text: "What is CSS used for?",
  expected: ["styling", "presentation", "layout", "HTML"],
  options: [
      "Cascading Style Sheets (CSS) is used for styling and presenting HTML content on the web.",
      "Creating dynamic web applications",
      "Managing databases",
      "Writing server-side logic"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "CSS (Cascading Style Sheets) is used for styling and presenting HTML content on the web."
},
{
  domain: "Web Development",
  text: "What does JavaScript allow you to do on a web page?",
  expected: ["interactivity", "dynamic", "client-side", "programming"],
  options: [
      "Add interactivity and dynamic behavior to web pages",
      "Style content",
      "Manage server operations",
      "Store data"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "JavaScript allows you to add interactivity and dynamic behavior to web pages."
},
{
  domain: "Web Development",
  text: "What is the purpose of a web server?",
  expected: ["server", "store", "serve", "content"],
  options: [
      "To store, process, and serve web content to clients over the internet",
      "To manage databases",
      "To perform client-side scripting",
      "To style web pages"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The purpose of a web server is to store, process, and serve web content to clients over the internet."
},
{
  domain: "Web Development",
  text: "What does HTTP stand for?",
  expected: ["Hypertext", "Transfer", "Protocol"],
  options: [
      "Hypertext Transfer Protocol",
      "Hyperlink Text Processing",
      "High Transfer Protocol",
      "Hypertext Template Processor"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "HTTP stands for Hypertext Transfer Protocol, which is used for transmitting web content."
},
{
  domain: "Web Development",
  text: "What is the Document Object Model (DOM)?",
  expected: ["programming", "structure", "HTML", "tree"],
  options: [
      "A programming interface that represents the structure of HTML documents in a tree format",
      "A type of web server",
      "A database architecture",
      "A CSS selection method"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The Document Object Model (DOM) is a programming interface that represents the structure of HTML documents in a tree format."
},
{
  domain: "Web Development",
  text: "What is AJAX?",
  expected: ["asynchronous", "JavaScript", "data", "requests"],
  options: [
      "Asynchronous JavaScript and XML, a technique for creating dynamic web applications",
      "A database management system",
      "A programming language",
      "A web server application"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "AJAX stands for Asynchronous JavaScript and XML, which is a technique for creating dynamic web applications."
},
{
  domain: "Web Development",
  text: "What is the difference between GET and POST methods in HTTP?",
  expected: ["data", "transmission", "GET", "POST"],
  options: [
      "GET retrieves data from a server, while POST sends data to a server for processing",
      "POST is faster than GET",
      "GET can send large amounts of data, while POST cannot",
      "There is no difference; they are the same"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "GET retrieves data from a server, while POST sends data to a server for processing."
},
{
  domain: "Web Development",
  text: "What is responsive web design?",
  expected: ["adapting", "layout", "devices", "screen"],
  options: [
      "Designing web pages that adapt to different screen sizes and devices for better user experience",
      "A technique for server management",
      "Creating static websites",
      "A web development framework"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Responsive web design is about designing web pages that adapt to different screen sizes and devices for better user experience."
},
{
  domain: "Web Development",
  text: "What does SQL stand for?",
  expected: ["Structured", "Query", "Language"],
  options: [
      "Structured Query Language, used for managing and querying databases",
      "Standard Query Language",
      "Sequential Query Language",
      "Special Query Language"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "SQL stands for Structured Query Language, which is used for managing and querying databases."
},
{
  domain: "Web Development",
  text: "What is a content management system (CMS)?",
  expected: ["software", "create", "manage", "content"],
  options: [
      "Software that helps users create, manage, and modify content on a website without specialized technical knowledge",
      "A type of database",
      "A programming language",
      "A design tool"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A content management system (CMS) is software that helps users create, manage, and modify content on a website without specialized technical knowledge."
},
{
  domain: "Web Development",
  text: "What is the purpose of SEO?",
  expected: ["search", "engine", "optimization", "visibility"],
  options: [
      "To optimize websites for search engines to increase their visibility in search results",
      "To improve web server performance",
      "To enhance user experience",
      "To create dynamic content"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "The purpose of SEO is to optimize websites for search engines to increase their visibility in search results."
},
{
  domain: "Web Development",
  text: "What is a web application?",
  expected: ["application", "software", "accessed", "browser"],
  options: [
      "Software accessed via a web browser that offers interactive features to users",
      "A static webpage",
      "A mobile application",
      "A database management system"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A web application is software accessed via a web browser that offers interactive features to users."
},
{
  domain: "Web Development",
  text: "What is front-end development?",
  expected: ["presentation", "user", "interface", "application"],
  options: [
      "The development of the client side of a web application that interacts with users and presents information",
      "Back-end database management",
      "Server-side scripting",
      "Web security"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Front-end development involves creating the client side of a web application that interacts with users and presents information."
},
{
  domain: "Web Development",
  text: "What is back-end development?",
  expected: ["server", "database", "application", "logic"],
  options: [
      "The development of server-side logic, databases, and application programming interfaces (APIs) for web applications",
      "Client-side design",
      "Content management",
      "Search engine optimization"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Back-end development involves creating server-side logic, databases, and application programming interfaces (APIs) for web applications."
},
{
  domain: "Web Development",
  text: "What is a URL?",
  expected: ["Uniform", "Resource", "Locator"],
  options: [
      "Uniform Resource Locator, the web address used to access resources on the internet",
      "Universal Routing Link",
      "Undefined Resource Locator",
      "Uniform Resource Link"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A URL (Uniform Resource Locator) is the web address used to access resources on the internet."
},
{
  domain: "Web Development",
  text: "What is Ajax used for?",
  expected: ["Asynchronous", "JavaScript", "XML", "requests"],
  options: [
      "For making asynchronous requests to the server to load data without refreshing the webpage",
      "Creating static pages",
      "Managing databases",
      "Styling web pages"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "AJAX is used for making asynchronous requests to the server to load data without refreshing the webpage."
},
{
  domain: "Web Development",
  text: "What is the purpose of a web framework?",
  expected: ["structure", "foundation", "application", "development"],
  options: [
      "To provide a structure and foundation for developing web applications more efficiently",
      "To manage databases",
      "To create user interfaces",
      "To provide security"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "A web framework provides a structure and foundation for developing web applications more efficiently."
},
{
  domain: "Web Development",
  text: "What is JSON?",
  expected: ["JavaScript", "Object", "Notation"],
  options: [
      "JavaScript Object Notation, a lightweight data interchange format that is easy for humans to read and write",
      "Java Source Object Notation",
      "Just Structured Object Notation",
      "JavaScript Optimized Notation"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write."
},
{
  domain: "Web Development",
  text: "What does Bootstrap provide?",
  expected: ["framework", "design", "responsive", "components"],
  options: [
      "A framework that provides pre-built components and styles for responsive web design",
      "A database management system",
      "An operating system tool",
      "A programming language"
  ],
  correctOption: 0,
  isMockQuestion: true,
  answer: "Bootstrap provides a framework that includes pre-built components and styles for responsive web design."
},
];

  Question.insertMany(questions)
    .then(() => {
      console.log("✅ Sample Questions Inserted!");
      mongoose.connection.close();
    })
    .catch(err => {
      console.error("❌ Error inserting sample questions:", err);
      mongoose.connection.close();
    });
};