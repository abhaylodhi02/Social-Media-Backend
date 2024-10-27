# Social media backend with JS

A backend service for a social media application built using Node.js and Express.js with MongoDB as the database. This backend supports essential functionalities like user authentication, profile and post management, and CRUD operations. It also includes data storage with Cloudinary for media uploads and utilizes various middlewares for handling requests and responses.

Key Features
User Authentication: Supports sign-up, login, logout, and session management using access and refresh tokens.
Profile Management: Allows users to update their profile information and upload profile pictures.
Post Management: Enables users to create, read, update, and delete posts with image uploads.
Data Operations: Performs CRUD operations on user and post data.
Data Aggregation: Leverages MongoDB aggregation pipelines to fetch user feeds and analytics.
Tools and Technologies Used
Node.js: JavaScript runtime environment for server-side code execution.
Express.js: Web application framework for routing and middleware.
MongoDB: NoSQL database for storing user and post data.
Cloudinary: Cloud-based image and video management for media uploads.
Postman: API development tool for testing and validating API endpoints.
Multer: Middleware for handling multipart/form-data, primarily for file uploads.
Bcrypt: Library for hashing passwords securely.
Axios: HTTP client for making requests, often used in testing API routes.
CORS: Middleware for enabling Cross-Origin Resource Sharing.
Nodemon: Tool for auto-restarting the server during development.
Prettier: Code formatter to maintain clean and consistent code style.
GitHub: Version control and repository hosting.
Key Components and Functionalities
User Management
Sign Up: New users can create an account with their email, password, and profile details.
Login: Existing users can log in and receive an access token and a refresh token.
Tokens:
Access token: Used for authorizing regular API requests.
Refresh token: Used to obtain new access tokens when the current one expires.
Password Security: Passwords are hashed using bcrypt to ensure security.
Profile and Post Management
Profile Management: Users can update profile details and upload a profile picture via Cloudinary.
Post CRUD Operations: Users can create, read, update, and delete posts with image attachments handled by Multer and stored in Cloudinary.
Data Aggregation: Uses MongoDB aggregation pipelines to retrieve customized feeds, post analytics, and user engagement statistics.
Middleware and Error Handling
Authentication Middleware: Protects routes by verifying access tokens and handling refresh tokens.
Multer Middleware: Handles file uploads, especially for images.
CORS Middleware: Enables cross-origin requests from different domains.
Error Handling: Consistent API error and response handling across endpoints to ensure clean client-server interaction.
Routing
Express Routers: Structured routes for user management, profile, and posts.
Protected Routes: Routes that require authentication and authorization are secured via middleware checks.
API Documentation
Postman: Used to document and test all API routes, ensuring that each endpoint works as expected before deployment.
Data Modelling
User Schema: Defines user properties such as name, email, password hash, profile picture URL, and other details.
Post Schema: Stores details about each post, including the content, images, timestamps, and author references.
Getting Started
Prerequisites
Node.js
MongoDB
Cloudinary account
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
cd social-media-backend
Install dependencies:

bash
Copy code
npm install
Create a .env file and add the following environment variables:

plaintext
Copy code
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
Start the server:

bash
Copy code
npm run dev
API Endpoints
User Routes:
POST /api/users/signup: Register a new user.
POST /api/users/login: Log in and receive an access token.
POST /api/users/refresh-token: Refresh access token.
Profile Routes:
GET /api/users/:id: Get user profile information.
PUT /api/users/:id: Update profile information.
Post Routes:
POST /api/posts: Create a new post.
GET /api/posts: Get a list of posts.
PUT /api/posts/:id: Update a specific post.
DELETE /api/posts/:id: Delete a specific post.
