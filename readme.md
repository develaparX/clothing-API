Here's a comprehensive documentation for your `majumundurapp` project, including the package dependencies, setup instructions, and how to run the application.

### Project Overview

**Project Name**: Maju Mundur clothing marketplace API

**Description**: This project is an API for a clothing marketplace named Maju Mundur. It handles user authentication, product management, and other marketplace functionalities.

### Dependencies

#### Main Dependencies:

1. **bcrypt**: A library to help you hash passwords.
2. **dotenv**: Loads environment variables from a `.env` file into `process.env`.
3. **express**: A fast, unopinionated, minimalist web framework for Node.js.
4. **jsonwebtoken**: An implementation of JSON Web Tokens.
5. **pg**: PostgreSQL client for Node.js.
6. **pg-hstore**: A module for serializing and deserializing JSON data to hstore format for PostgreSQL.
7. **sequelize**: A promise-based Node.js ORM for PostgreSQL.

#### Development Dependencies:

1. **jest**: A delightful JavaScript Testing Framework with a focus on simplicity.
2. **nodemon**: A tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
3. **sequelize-mock**: Mocking library for Sequelize, useful for testing.
4. **supertest**: A library for testing Node.js HTTP servers.

### Package Scripts

- **start**: Runs the application using Node.js.
- **dev**: Runs the application with `nodemon` for automatic restarts on file changes.
- **test**: Runs the test suite using `jest`.

### Setting Up the Environment

Before running the application, you need to configure the environment variables. Create a `.env` file in the root directory of your project with the following content:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=majumundurdatabase
JWT_SECRET=your_secret_key
```

### Database Setup

Ensure you have PostgreSQL installed and running. Create a database named `maju_mundur_makmur` and execute the SQL commands from the `ddl.sql` file to set up the required tables.

### Running the Application

1. **Install Dependencies**: Run the following command to install all required dependencies:

   ```bash
   npm install
   ```

2. **Run the Application**: Use one of the following commands to start the application:

   - For production:
     ```bash
     npm start
     ```
   - For development with auto-restart on changes:
     ```bash
     npm run dev
     ```

3. **Run Tests**: To run the test suite, use:
   ```bash
   npm test
   ```

### API Collection

The API collection provided in the file `clothingApi-Collection.json` includes all the endpoints and example requests for the Maju Mundur clothing marketplace API. This collection can be imported into Postman to facilitate testing and exploring the API.

1. **Importing into Postman**:
   - Open Postman.
   - Click on `Import` in the top left corner.
   - Select `Upload Files` and choose the `clothingApi-Collection.json` file.
   - The collection will be added to your Postman workspace.

### API Endpoints Documentation

Here is a list of the endpoints included in your Maju Mundur clothing marketplace API based on the provided collection. Each endpoint is described with its HTTP method, URL, and a brief description of its functionality.
Certainly. Here's a brief documentation of the API endpoints mentioned in the provided file:

1. Authentication (Auth)

   - POST /api/auth/login: User login
   - POST /api/auth/register: User registration

2. Products

   - POST /api/products: Create a new product (Merchant only)
   - GET /api/products: Retrieve all products
   - PUT /api/products/:id: Update a specific product (Merchant only)
   - DELETE /api/products/:id: Delete a specific product (Merchant only)

3. Rewards

   - POST /api/rewards: Create a new reward (Merchant only)
   - GET /api/rewards: Retrieve all rewards
   - PUT /api/rewards/:id: Update a specific reward (Merchant only)
   - DELETE /rewards/:id: Delete a specific reward (Merchant only)

4. Transactions

   - POST /api/transactions/product: Create a product transaction
   - POST /api/transactions/reward: Create a reward transaction
   - GET /api/transactions: Retrieve all transactions for the authenticated user

5. Merchant-specific

   - GET /api/transactions/products: Retrieve customer product transactions (Merchant only)
   - GET /api/transactions/rewards: Retrieve customer reward transactions (Merchant only)

6. User Management
   - GET /api/users/me: Retrieve details of the authenticated user
   - PUT /api/users/:id/wallet: Add balance to a user's wallet (Merchant only)
   - GET /api/users/all: Retrieve all users (Merchant only)

Note: Most endpoints require authentication via a bearer token. Merchant-only endpoints are restricted to users with a merchant role.
