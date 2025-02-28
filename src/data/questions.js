const questionsData = {
    "Software Engineering": [
      {
        question: "What is Object-Oriented Programming (OOP)?",
        answer: "Object-Oriented Programming (OOP) is a programming paradigm that uses objects and classes to organize code and data. OOP focuses on the idea of 'objects,' which are instances of 'classes' and can contain both data (attributes) and methods (functions)."
      },
      {
        question: "Explain a time when you worked in a team to solve a problem.",
        answer: "In my previous job, I worked with a cross-functional team to develop a new feature. We collaborated by communicating regularly and sharing ideas to solve technical challenges and deliver the feature on time."
      },
      {
        question: "What is polymorphism?",
        answer: "Polymorphism in OOP allows different classes to be treated as instances of the same class through inheritance. It enables objects of different classes to be treated as objects of a common superclass."
      },
      {
        question: "Explain the concept of a Design Pattern.",
        answer: "A Design Pattern is a reusable solution to a commonly occurring problem in software design. Examples include the Singleton, Factory, and Observer patterns, which help solve issues like object creation, object interactions, and object behavior in a clean, maintainable way."
      },
      {
        question: "What is a REST API and how does it work?",
        answer: "A REST API (Representational State Transfer) is a set of rules and conventions used to build and interact with web services. It is stateless, uses HTTP methods like GET, POST, PUT, DELETE, and typically communicates with JSON or XML data formats."
      }
    ],
    "Data Science": [
      {
        question: "Explain the difference between supervised and unsupervised learning.",
        answer: "Supervised learning involves training a model on labeled data, where the target variable is known. Unsupervised learning, on the other hand, involves finding patterns in data without labeled outcomes, such as clustering and dimensionality reduction."
      },
      {
        question: "What is cross-validation?",
        answer: "Cross-validation is a technique used to assess the performance of machine learning models by dividing the dataset into multiple subsets (folds). The model is trained on a subset and tested on the remaining data, and this process is repeated for each fold."
      },
      {
        question: "What is a confusion matrix?",
        answer: "A confusion matrix is a table used to evaluate the performance of a classification model. It shows the counts of actual vs predicted values, with metrics like precision, recall, accuracy, and F1-score derived from the matrix."
      },
      {
        question: "What is overfitting and how can it be prevented?",
        answer: "Overfitting occurs when a model learns the noise in the training data rather than the actual patterns, leading to poor performance on unseen data. It can be prevented by using techniques like regularization, cross-validation, and early stopping."
      },
      {
        question: "Explain the concept of feature engineering.",
        answer: "Feature engineering is the process of transforming raw data into meaningful features that improve the performance of a machine learning model. This includes techniques like normalization, encoding categorical variables, and creating new features from existing data."
      }
    ],
    "Product Management": [
      {
        question: "What is the role of a product manager?",
        answer: "A product manager is responsible for the overall strategy, roadmap, and features of a product. They work closely with stakeholders, designers, developers, and marketers to define the product vision and ensure its successful development and launch."
      },
      {
        question: "Explain a time when you had to prioritize features for a product.",
        answer: "In a previous role, I had to prioritize features based on user feedback and business goals. I created a weighted scoring model that took into account factors like customer demand, business impact, and technical feasibility to decide which features to prioritize."
      },
      {
        question: "How do you handle conflict between stakeholders?",
        answer: "When conflict arises between stakeholders, I facilitate open communication and ensure that all parties are heard. I work to align everyone around the product’s goals and focus on data-driven decisions to help resolve the issue."
      },
      {
        question: "How do you measure the success of a product?",
        answer: "Success can be measured using metrics such as user adoption, customer satisfaction (via surveys or feedback), retention rates, and the achievement of business goals like revenue growth or market share increase."
      },
      {
        question: "What is Agile methodology and how do you use it in product development?",
        answer: "Agile methodology is an iterative approach to product development that emphasizes flexibility, collaboration, and customer feedback. As a product manager, I work closely with development teams to break down tasks into small, manageable sprints and deliver features incrementally."
      }
    ],
    "Marketing": [
      {
        question: "What is SEO and why is it important?",
        answer: "SEO (Search Engine Optimization) is the process of optimizing a website to rank higher in search engine results. It’s crucial for increasing visibility, driving traffic, and improving the user experience on your site."
      },
      {
        question: "Explain the concept of a marketing funnel.",
        answer: "A marketing funnel is a model that describes the stages a potential customer goes through before making a purchase, typically divided into awareness, consideration, and decision stages."
      },
      {
        question: "How do you determine the target audience for a product?",
        answer: "To determine the target audience, I analyze demographic data, customer feedback, market trends, and competitor strategies to define the most relevant segment of the population that would benefit from the product."
      },
      {
        question: "What is the difference between inbound and outbound marketing?",
        answer: "Inbound marketing focuses on attracting customers through content creation, social media, and SEO, while outbound marketing involves proactive methods like paid advertising, direct mail, and cold calling."
      },
      {
        question: "How do you measure the effectiveness of a marketing campaign?",
        answer: "Effectiveness can be measured through key performance indicators (KPIs) such as return on investment (ROI), customer acquisition cost (CAC), engagement rates, and conversions."
      }
    ]
  };
  
  export default questionsData;
  