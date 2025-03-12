```
healthcare-ai-diagnostic-system/
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── components/
│       │   ├── auth/
│       │   │   └── Login.js
│       │   ├── dashboard/
│       │   │   └── Dashboard.js
│       │   ├── patients/
│       │   │   ├── PatientList.js
│       │   │   └── PatientProfile.js
│       │   └── diagnostics/
│       │       ├── diabetes/
│       │       │   └── DiabetesForm.js
│       │       └── brainTumor/
│       │           └── BrainTumorForm.js
│       ├── pages/
│       │   ├── HomePage.js
│       │   ├── DashboardPage.js
│       │   └── DiagnosticsPage.js
│       └── services/
│           ├── api.js
│           ├── auth.service.js
│           └── patient.service.js
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── patients.py
│   │   └── diagnostics.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   └── diagnostic.py
│   ├── ml_models/
│   │   ├── __init__.py
│   │   ├── model_registry.py
│   │   ├── diabetes/
│   │   │   └── connector.py
│   │   └── brain_tumor/
│   │       └── connector.py
│   └── utils/
│       ├── __init__.py
│       ├── db.py
│       └── security.py
│
├── images/
│   └── ...
│
└── docs/
    ├── api_docs.md
    ├── model_integration.md
    ├── development_plan.md
    └── project_structure.md
```

## Top-Level Directory

- **docker-compose.yml**: Orchestrates all containers (frontend, backend, database) to work together

## Frontend Directory

The frontend is built with React.js and contains the user interface components.

- **package.json**: Lists all dependencies and scripts for the React application
- **src/**: Contains all React source code
  - **index.js**: Entry point for the React application
  - **App.js**: Main React component that sets up routing

### Frontend Components

- **auth/**: Components for login, registration, and authentication
- **dashboard/**: Dashboard components showing system overview and statistics
- **patients/**: Components for managing patient information
  - **PatientList.js**: Displays a searchable list of patients
  - **PatientProfile.js**: Shows detailed patient information
- **diagnostics/**: Components for the diagnostic tools
  - **diabetes/**: Components for diabetes prediction
  - **brainTumor/**: Components for brain tumor detection

### Frontend Pages

Pages are composed of multiple components and represent full screens in the application:

- **HomePage.js**: Landing page for the application
- **DashboardPage.js**: Main dashboard for healthcare professionals
- **DiagnosticsPage.js**: Page for running diagnostic tests

### Frontend Services

Services handle communication with the backend API:

- **api.js**: Base configuration for API requests
- **auth.service.js**: Handles authentication API calls
- **patient.service.js**: Manages patient-related API calls

## Backend Directory

The backend is built with Python/Flask and handles business logic, database operations, and ML model integration.

- **app.py**: Main Flask application entry point
- **config.py**: Configuration settings for the backend
- **requirements.txt**: Lists Python dependencies

### Backend API

The API directory contains endpoints organized by feature:

- **auth.py**: Authentication endpoints (login, logout, register)
- **patients.py**: Patient management endpoints (CRUD operations)
- **diagnostics.py**: Diagnostic process endpoints (predictions, results)

### Backend Models

Database models representing the application's data structures:

- **user.py**: User model for healthcare professionals
- **patient.py**: Patient information model
- **diagnostic.py**: Diagnostic results and history model

### ML Models Integration

Connects to your pre-built ML models using MLflow and ZenML:

- **model_registry.py**: Central registry for all prediction models
- **diabetes/connector.py**: Connector for the diabetes prediction model
- **brain_tumor/connector.py**: Connector for the brain tumor detection model

### Backend Utilities

Helper functions and services:

- **db.py**: Database connection and configuration
- **security.py**: Security utilities (password hashing, token generation)

## Images Directory

Contains images used in documentation and potentially the application itself.

## Docs Directory

Project documentation:

- **api_docs.md**: API endpoint documentation
- **model_integration.md**: Instructions for integrating ML models
- **development_plan.md**: The development roadmap and phases
- **project_structure.md**: Description of the project file structure