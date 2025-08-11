# Requirement Prioritization App

## Overview
The Requirement Prioritization App is a single-page application built with React that allows users to manage software requirements, analyze dependencies, and prioritize requirements based on contextual features. The application utilizes the React Context API for state management and localStorage for data persistence, ensuring that user data is not lost on page reloads.

## Project Structure
```
requirement-prioritization-app
├── index.html
├── src
│   ├── App.jsx
│   ├── pages
│   │   ├── HomePage.jsx
│   │   ├── RequirementInsertionPage.jsx
│   │   ├── DependencyAnalysisPage.jsx
│   │   ├── PrioritizationResultsPage.jsx
│   │   ├── ContextualFeatureEditPage.jsx
│   │   └── DependencyEditPage.jsx
│   ├── components
│   │   ├── RequirementTable.jsx
│   │   ├── DependencyTable.jsx
│   │   ├── ContextualFeatureDropdowns.jsx
│   │   └── DependencyInput.jsx
│   └── styles.css
└── README.md
```

## Features
- **Home Page**: Entry point with options for Manual and Automated Prioritization modes.
- **Requirement Insertion**: Add requirements and contextual features, and trigger dependency analysis.
- **Dependency Analysis**: View and edit dependencies between requirements.
- **Prioritization Results**: Display prioritization results and allow editing of priority scores.
- **Contextual Feature Editing**: Edit contextual features of existing requirements.
- **Dependency Editing**: Modify existing dependencies or add new ones.

## Technologies Used
- **React**: For building the user interface.
- **React Router**: For navigation between different pages.
- **Axios**: For making API calls.
- **xlsx**: For exporting data to Excel files.
- **Tailwind CSS**: For styling the application.
- **Babel**: For compiling JSX in the browser.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Open `index.html` in a web browser to run the application.

## Usage
- Navigate through the application using the buttons on the Home Page.
- Add requirements and contextual features on the Requirement Insertion Page.
- Analyze dependencies and prioritize requirements on the respective pages.
- Export prioritization results to an Excel file.

## Contribution
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.