Product & Order Management REST API
Training Workshop Node.js 6 November 2026 (Inet)

Tech Stack
Runtime: Node.js
Framework: Express.js
Database: MongoDB
ODM: Mongoose
Authentication: JSON Web Token (JWT)
Password Hashing: bcrypt
API Testing: Postman
Configuration: dotenv

Installation

1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the project root:
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=workshop1
JWT_SECRET=your_secure_jwt_secret

4. Start MongoDB
Ensure that the local MongoDB server is running.

5. Start the application
npm start
The API will be available at:
http://localhost:3000/api/v1
