# Full Stack Project - README

This is a full stack project that utilizes React, Node.js, MySQL, MySQL Workbench, Postman, JavaScript, Sequelize, and PapaParse. The project involves the development of a web application that allows importing data through a CSV file on the frontend. The backend handles routes, models, and validations to ensure data integrity and security.

## Technologies Used

- React
- Node.js
- MySQL
- MySQL Workbench
- Postman
- JavaScript
- Sequelize
- PapaParse

## Getting Started

To get started with the project, follow the steps below:

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd <project_directory>`
3. Install the necessary dependencies:
   - For the backend:
     - Install Sequelize: `npm install sequelize`
   - For the frontend:
     - Install PapaParse: `npm install papaparse`
4. Set up the MySQL database using MySQL Workbench.
5. Update the database configuration in the backend to match your MySQL database.
6. Start the server using the command: `npm run dev`

## Backend

The backend of this project is built using Node.js and utilizes Sequelize as the ORM (Object-Relational Mapping) tool to interact with the MySQL database. It handles routes, models, and validations to ensure the smooth flow of data and maintain data integrity.

### Routes

The backend consists of various routes that handle different operations. These routes define the endpoints for data retrieval, creation, update, and deletion. Each route is responsible for processing incoming requests, performing the necessary actions on the data, and sending appropriate responses.

### Models

Models in the backend represent the structure of the data stored in the MySQL database. Sequelize simplifies the creation and management of models by providing a robust set of functionalities. Models define the tables and relationships in the database, allowing you to interact with the data using JavaScript objects.

### Validations

Data validation is a critical aspect of this project to ensure the accuracy and security of the data. The backend implements validations to check the integrity of the incoming data. By enforcing validation rules, we can prevent invalid or malicious data from being stored in the database. Validations are implemented at the model level to ensure that data meets the specified criteria before being processed or stored.

## Frontend

The frontend of this project is developed using React, providing a user-friendly interface for importing data through a CSV file. The data from the CSV file is then processed and sent to the backend for further validation and storage in the MySQL database.

The frontend uses PapaParse, a JavaScript library, to handle CSV parsing. PapaParse offers efficient parsing capabilities and enables the user to preview and manipulate the imported data before submitting it to the backend.

## Conclusion

This full stack project demonstrates the integration of multiple technologies to create a powerful web application. By combining React for the frontend, Node.js for the backend, MySQL for database management, and Sequelize for data handling, we achieve a robust and scalable solution. The backend handles routes, models, and validations to ensure data integrity, while the frontend allows easy importing of CSV data.

## Deploy

The project is online and can be used using the sample CSV file on the project.

https://vercel.com/eduvinagre/fullstack-sql-javascript

The backend is uploaded to Cyclic using Postgres

## Techs Used

NodeJs, MySQL, Postman, JavaScript, React, Sequelize, VSCode

## Project Status

Finalized
