# Record-Management-Backend

- API to facilitate the management and viewing of academic records.
- Involves three levels of users i.e., the super admin, the admin and the user.
- Includes all CRUD functionality as well as access restrictions to records.
- Developed using NodeJS and Express. Database on MongoDB Atlas.

## How to setup

1. Run `npm install` to install all dependancies.

2. Set up a .env file and set up the following environment variables

   1. MONGO_URI - MongoDB Atlas connection string
   2. JWT_SECRET - Json Web Token key
   3. JWT_LIFETIME - Json Web Token lifetime
   4. PASS - Default password setup for admins
   5. COLLEGE - Default mail terminator for users (non admins). e.g. @iitxyz.ac.in
      <br>

3. Setup email, password and user name for the super admin in start.js. Run `node start.js`

4. Start the server by typing `node app.js`. Optionally, you can install the dev dependancy i.e., nodemon and set up the command in package.json.

5. Login using the super admin credentials. You are ready to start using the API.

- NOTE: You can optionally set up a PORT in .env to run it on your local machine. The default port on the local machine will be 3000.

## API Methods

- Detailed documentation can be found [here](https://irms.onrender.com/)

## API Details

- If request is made to set up the admin, default password will be PASS. If request is made to set up the user, the default password will be the entry number in lowercase.

## Additional Information

- All paths apart from user login and admin login require the JWT that the server sends back in order to be accessed.
- Kindly set up a unguessable random string as the JWT_SECRET.
- Kindly change the minlengths set up in various models if your particular use case involves the use of shorter names, email ids or entry numbers
- Kindly mail 2020csb1062@iitrpr.ac.in if you find ways to access resources that should not be allowed.
