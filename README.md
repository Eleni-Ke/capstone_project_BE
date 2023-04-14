# Book Writing Application Back end

## Overview
This is the backend of a book writing application. Users can create characters, places, and storylines to help organize their writing process. Data is stored in a database. (Probably MongoDB)

## Installation
To install the application, clone the repository and run npm install to install dependencies. Then run npm start to start the server.

## API Documentation
The API includes the following endpoints:

/characters - CRUD endpoints for characters
/places - CRUD endpoints for places
/storylines - CRUD endpoints for storylines
(probably more to come)

## Configuration
The application uses environment variables for configuration. Please refer to the .env.example file for more information.

## Dependencies
- Express.js
- MongoDB
- Mongoose
- Dotenv
- Database Schema
- The database includes collections for characters, places, and storylines. They will be included in the schema folder.

## Testing
To run the test: npm test. (they will be added)

## Deployment
To deploy the application to a production environment, set the environment variables for the production environment and run npm start.
