Project Structure Of Melih's Game Vault

backend: Spring Boot application (REST API & PostgreSQL).

frontend: React application (User Interface).

1. Database Setup (PostgreSQL)
 
Credentials:

Username: postgres

Password: 123456

Create Database: Create a database named ecommdb.

Create Table: Run the following SQL command to set up the products:

SQL

DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products ( 
    id BIGSERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    description VARCHAR(500), 
    price NUMERIC(10, 2) NOT NULL, 
    image_url VARCHAR(512), 
    featured BOOLEAN NOT NULL DEFAULT FALSE, 
    details TEXT, 
    category VARCHAR(255) 
);

Insert Data: Import the data using the file located at: backend/src/main/resources/data.sql

2. Backend Setup (Spring Boot)

Open the backend folder in IntelliJ.

Wait for the project to load and index.

Run the EcommApplication class.

The backend will run on: http://localhost:8080

3. Frontend Setup (React)

Open a terminal in the frontend folder.

Install packages:

Bash

npm install

Start the app:

Bash

npm start

The frontend will run on: http://localhost:3000

4. Access Links

User Interface: http://localhost:3000

API Endpoints: http://localhost:8080/api

Note: Ensure PostgreSQL, the Backend, and the Frontend are all running at the same time.


