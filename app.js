require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectToDB = require("./db/db");

// importing routers
const loginRouter = require("./routes/login");
const userDataRouter = require("./routes/user");
const adminDataRouter = require("./routes/admin");

// middleware
const errorHandler = require("./middleware/errorHandler");
const authorizeUser = require("./middleware/authenticateUser");
const authorizeAdmin = require("./middleware/authenticateAdmin");
const isAdmin = require("./middleware/isAdmin");
const isUser = require("./middleware/isUser");

// allows data to be processed as json in req.body
app.use(express.json());

// routers
app.use("/api/authorize", loginRouter);
app.use("/api/user", [authorizeUser, isUser], userDataRouter);
app.use("/api/admin", [authorizeAdmin, isAdmin], adminDataRouter);

// middleware
app.use(errorHandler);

// port selection
const port = process.env.PORT || 3000;

// connecting to database and starting the server
const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server open on port ${port}`);
    });
  } catch (error) {
    console.log("Unable to connect to database");
  }
};

start();
