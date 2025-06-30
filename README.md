# ProjectFlow - Project Management Tool

This is a full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

*   [Node.js](https://nodejs.org/en/) (which includes `npm`)
*   [MongoDB](https://www.mongodb.com/try/download/community)

## Local Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

First, clone the project repository to your computer.

```bash
git clone https://github.com/parankushamakhil/CodeAlpha_ProjectManagementTool
```


### 2. Navigate to the Project Directory

```bash
cd CodeAlpha_ProjectManagementTool
```

### 3. Install Dependencies

Install all the project dependencies using npm.

```bash
npm install
```

### 4. Ensure MongoDB is Running

Make sure your local MongoDB server is running. By default, the application will attempt to connect to `mongodb://localhost:27017/projectflow`.

*(Optional: If you wish to use a different database, you can set the `MONGO_URI` environment variable in your shell before running the application.)*

### 5. Run the Application

Use the `dev` script to start both the backend server and the frontend development server.

```bash
npm run dev
```

You should see output indicating that both servers are running:
*   The **frontend** will be available at `http://localhost:5173`.
*   The **backend** server will be running on `http://localhost:3001`.

You can now open your browser and navigate to `http://localhost:5173` to use the application.

---

### Note on Configuration

*   **Database:** The MongoDB connection URI is set in `server/config/db.js` and defaults to a local instance. It can be overridden with the `MONGO_URI` environment variable.
*   **Authentication:** For development purposes, the JWT secret is hardcoded in `server/index.js`. It is recommended to move this to an environment variable for production environments. 
