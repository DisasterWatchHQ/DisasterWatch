# DisasterWatch
  This repo contains the group project for module IT3162

 **This branch is only for the backend development**

 Current map we have in mind

  Backend (Node.js/Express)
    ├── RESTful API Endpoints
    │     ├── /reports (CRUD for Disaster Reports)
    │     ├── /weather (Fetch Weather Data)
    │     ├── /predictions (ML Model Predictions)
    │     ├── /users (User Authentication & Profiles)
    │     └── /hotlines (Emergency Contact Management)
    ├── Database (MongoDB)
    │     ├── Collections
    │     │     ├── users
    │     │     ├── reports
    │     │     ├── predictions
    │     │     └── hotlines
    ├── Machine Learning (Hosted Model on Cloud)
    │     ├── TensorFlow/Python for ML Model
    └── Authentication & Security (Firebase Auth)

  **For Team members**

  The commit type can be one of the following:
    - feat: Commits, which adds a new feature
    - fix: Commits, that fixes a bug
    - refactor: Commits, that rewrite/restructure your code, however, do not change any behavior
    - perf: Commits are special refactor commits, that improve performance
    - style: Commits, that do not affect the meaning (white space, formatting, missing semi-colons, etc)
    - test: Commits, that add missing tests or correct existing tests
    - docs: Commits, that affect documentation only
    - build: Commits, that affect build components like build tool, ci pipeline, dependencies, project version, ...
    - ops: Commits, that affect operational components like infrastructure, deployment, backup, recovery...
    - chore: Miscellaneous commits e.g. modifying .gitignore