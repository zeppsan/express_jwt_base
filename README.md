
# Express JWT Base 
[![ExpressJS](https://github.com/MarioTerron/logo-images/blob/master/logos/expressjs.png)](http://expressjs.com///)

This is a ready-to-use foundation for an express server that uses JWT for client-server authorization. Add all the functionality that you might need with ease! The server runs Sequelize as ORM, so no No-SQL databases can be used. For testing, JEST / Supertester is used.

### How to run the server
Clone the project and configure the server for your enviroment. Start by creating a .env file and copy the contents of the env file. Then fill in the neccesary variables such as database credentials and JWT_SECRET. After that, you are ready to run the app.
```bash
  npm install
  npm start
```
    
### How to run tests?
The tests are located in the __tests\_\_ folder. If you would like to add more tests, just create a new suit by creating another js file.
```bash
  npm test
```



### Author
- [@Zeppsan](https://github.com/zeppsan)
