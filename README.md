# Record-Management-Backend

- API to facilitate the management and viewing of academic records.
- Involves three levels of users i.e., the super admin, the admin and the user.
- Includes all CRUD functionality as well as access restrictions to records.
- Developed using NodeJS and Express. Database on MongoDB Atlas. Hosted on Heroku.

## How to setup

- Run `npm install` to install all dependancies.

- Set up a .env file and set up the following environment variables

  1. MONGO_URI - MongoDB Atlas connection string
  2. JWT_SECRET - Json Web Token key
  3. JWT_LIFETIME - Json Web Token lifetime
  4. PASS - Default password setup for admins
  5. COLLEGE - Default mail terminator for users (non admins). e.g. @iitxyz.ac.in
     <br>

- Setup email, password and user name for the super admin in start.js. Run `node start.js`

- Login using the super admin credentials. You are ready to start using the API.

- NOTE: You can optionally set up a PORT in .env to run it on your local machine. The default port on the local machine will be 3000.

## API Methods
