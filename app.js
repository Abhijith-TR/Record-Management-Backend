require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectToDB = require("./db/db");

const userRouter = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");
const authorize = require("./middleware/authenticate");

// allow data to be processed as json in req.body
app.use(express.json());

// routers
app.use("/api/authorize", userRouter);

// middleware
app.use(errorHandler);

// port selection
const port = process.env.PORT || 3000;

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
