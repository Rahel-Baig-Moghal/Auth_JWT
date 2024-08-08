# Authentication System with JWT using Node.js, React, and MongoDB

This project is a full-stack application that demonstrates user authentication using JSON Web Tokens (JWT) with a frontend built using React and a backend built using Node.js, Express, and MongoDB.

## Features

- **User Registration**: New users can create an account by providing a username, email, and password.
- **User Login**: Registered users can log in with their username and password.
- **Token-Based Authentication**: Authentication is handled using JWT, providing secure access to protected resources.
- **Refresh Tokens**: The application implements refresh tokens to manage short-lived access tokens, allowing users to stay logged in without needing to re-enter their credentials.
- **User Logout**: Users can log out, which revokes the refresh token and prevents unauthorized access.
- **Protected Routes**: Certain routes are protected and only accessible to authenticated users.

## Project Structure

### Frontend

The frontend is built using React and consists of the following main components:

- **Home Component**: Displays a welcome message to the logged-in user and provides a logout option.
- **Login Component**: Handles user login, sending the username and password to the backend for authentication.
- **SignIn Component**: Handles user registration, allowing new users to create an account.

### Backend

The backend is built using Node.js and Express, and it interacts with MongoDB to store user data. Key features include:

- **User Registration**: Handles creating a new user, hashing their password, and generating a refresh token.
- **User Login**: Verifies user credentials and issues an access token.
- **Token Refreshing**: Issues a new access token using a valid refresh token.
- **User Data Retrieval**: Fetches authenticated user data.
- **User Logout**: Revokes the user's refresh token to ensure they are logged out.

### Server-Side Code

- **Express.js**: A minimal and flexible Node.js web application framework.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, used to manage data.
- **JWT**: JSON Web Tokens are used for securely transmitting information between parties as a JSON object.

### Authentication Flow

1. **User Registration**: When a user registers, their password is hashed using bcrypt, and a refresh token is generated and stored in the database. The refresh token is signed using a secret key.

2. **User Login**: The user provides their username and password. If the credentials are correct, an access token is generated and returned to the user.

3. **Token Refresh**: The refresh token is sent to the server to generate a new access token without re-entering credentials.

4. **User Logout**: The refresh token is invalidated, and the user is logged out.

## API Endpoints

### Authentication Endpoints

- **POST /createUser**: Registers a new user.
- **POST /users/login**: Logs in a user.
- **POST /token**: Generates a new access token using a refresh token.
- **POST /user/logout**: Logs out a user and invalidates their refresh token.

### Protected Endpoints

- **POST /user/data**: Retrieves user data for authenticated users.

## Environment Variables

To run this project, you need to set up the following environment variables:

- **Access_Token_Secret**: Secret key for signing access tokens.
- **Refresh_Token_Secret**: Secret key for signing refresh tokens.

You can set up these variables in a `.env` file:


Access_Token_Secret=your_access_token_secret
Refresh_Token_Secret=your_refresh_token_secret


## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Install dependencies for both the frontend and backend:

   bash
   npm install
   

2. Set up your environment variables in the `.env` file.

3. Start MongoDB.

4. Start the backend server:

   ```bash
   npm start
   ```

5. Start the frontend:

   ```bash
   cd client
   npm start
   ```

### Running the Application

- The backend runs on `http://localhost:3001`.

### Deployment

To deploy this application, ensure your environment variables are correctly configured on your server or cloud platform, and use a MongoDB instance accessible by your backend.

