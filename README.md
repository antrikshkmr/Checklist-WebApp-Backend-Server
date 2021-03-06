<h2 align="center">
  Sample CheckList Tool Backend Server<br/>
</h2>

<br/>

## About the project

This is the Backend API server for the Sample checklist webapp which can be used to manage your to-do list of items. The frontend code can be found here <a href="https://github.com/antrikshkmr/Checklist-WebApp" target="_blank">Checklist-WebApp</a>.<br/>

This project is built using these technologies.

- React.js
- Node.js
- Express.js
- MongoDb

## Getting Started

Clone this repository. You will need `Node.js` & `Git` installed globally on your machine and `MongoDb` setup either in cloud or local.

## Installation and Setup Instructions

1.  Get the `MongoDB Connection String` for your MongoDb instance (cloud or local)
1.  Create environment variable file with the following variables:

    ### **File Name**:

         .env

    #### Variables:

    > PORT=`PORT_NUMBER`<br/>
    > DB_CONNECTION_STRING=`YOUR_MONGODB_CONNNECTION_STRING`/masterDb
    > JWT_SECRET_KEY=`YOUR_SECRET_KEY`

2)  Open the terminal/cmd in the project root directory and run `npm install` command.

3)  Run `npm start` command in your terminal/cmd.

    This would run the app in development mode on the port number you specified in the environment file.
    Open [http://localhost:8000/](http://localhost:8000) in your browser or postman to run the dummy api. You will get `Welcome to Checklist Backend Server` message as response from the server.

    > If you want that your changes are automatically taken and the server starts again, you can run `npm run dev` command in your terminal/cmd _(It uses nodemon to take the new changes and deploy the server automatically)_

## Usage Instructions

Open the project root folder. You will find all the directories with relevant files.<br/>
Each file has inline comments for easy understanding of the code.<br/>

## Sources

- <a href="https://www.npmjs.com/package/express" target="_blank">express</a> : Fast, unopinionated, minimalist web framework for node.

- <a href="https://www.npmjs.com/package/mongoose" target="_blank">mongoose</a> : MongoDB object modeling tool designed to work in an asynchronous environment.

- <a href="https://www.npmjs.com/package/body-parser" target="_blank">body-parser</a> : Node.js body parsing middleware.

- <a href="https://www.npmjs.com/package/jsonwebtoken" target="_blank">jsonwebtoken</a> : An implementation of JSON Web Tokens for React.js and Node.js.

- <a href="https://www.npmjs.com/package/nodemon" target="_blank">nodemon</a> : Nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

- <a href="https://www.npmjs.com/package/bcrypt" target="_blank">bcrypt</a> : Library for password hasing.

- <a href="https://www.npmjs.com/package/dotenv" target="_blank">dotenv</a> : Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
