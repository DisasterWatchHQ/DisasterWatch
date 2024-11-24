# DisasterWatch
  This repo contains the group project for module IT3162

 Current map we have in mind

 Frontend (React Native/Expo)<br/>
   ├── Screens<br/>
   │     ├── HomeScreen (Disaster Feed + Map)<br/>
   │     ├── ReportingScreen (User Reports)<br/>
   │     ├── HotlinesScreen (Emergency Contacts)<br/>
   │     ├── NotificationSettingsScreen (Preferences)<br/>
   │     ├── UserProfileScreen (Profile Management)<br/>
   │     └── OnboardingScreen (Introduction for New Users)<br/>
   ├── Components<br/>
   │     ├── DisasterCard (List of Disaster Alerts)<br/>
   │     ├── MapView (Interactive Map with Markers)<br/>
   │     ├── ReportForm (Disaster Reporting Form)<br/>
   │     ├── AlertModal (Notifications/Popups)<br/>
   │     └── LoadingSpinner (Reusable Loading Indicator)<br/>
   ├── State Management (Redux)<br/>
   ├── APIs (Integration with OpenWeatherAPI, Cloud ML Model)<br/>
   ├── Push Notifications (Firebase Cloud Messaging)<br/>
  
 Backend (Node.js/Express)<br/>
    ├── RESTful API Endpoints<br/>
    │     ├── /reports (CRUD for Disaster Reports)<br/>
    │     ├── /weather (Fetch Weather Data)<br/>
    │     ├── /predictions (ML Model Predictions)<br/>
    │     ├── /users (User Authentication & Profiles)<br/>
    │     └── /hotlines (Emergency Contact Management)<br/>
    ├── Database (MongoDB)<br/>
    │     ├── Collections<br/>
    │     │     ├── users<br/>
    │     │     ├── reports<br/>
    │     │     ├── predictions<br/>
    │     │     └── hotlines<br/>
    ├── Machine Learning (Hosted Model on Cloud)<br/>
    │     ├── TensorFlow/Python for ML Model<br/>
    └── Authentication & Security (Firebase Auth)<br/>
    
  **For Team members**

  The commit type can be one of the following:<br/>
    - feat: Commits, which adds a new feature<br/>
    - fix: Commits, that fixes a bug<br/>
    - refactor: Commits, that rewrite/restructure your code, however, do not change any behavior<br/>
    - perf: Commits are special refactor commits, that improve performance<br/>
    - style: Commits, that do not affect the meaning (white space, formatting, missing semi-colons, etc)<br/>
    - test: Commits, that add missing tests or correct existing tests<br/>
    - docs: Commits, that affect documentation only<br/>
    - build: Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...<br/>
    - ops: Commits, that affect operational components like infrastructure, deployment, backup, recovery...<br/>
    - chore: Miscellaneous commits e.g. modifying .gitignore<br/>