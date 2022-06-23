require("dotenv").config();

const express = require("express");
const app = express();
const connectToDB = require("./db/db");
const mongoose = require("mongoose");
const Admin = require("./models/admin");

// set these variables up to the correct value.
// WARNING - The only way to change the super user is to manually log in to the database and change the value
// Kindly set up the super user and delete the file before deploying
const email = "";
const name = "";
const password = "";

const port = process.env.PORT || 3000;

const setup = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    var server = app.listen(port, () => {
      console.log(`Server open on port ${port}`);
    });
    if (!name || !email || !password) {
      console.log("Enter valid credentials");
      mongoose.disconnect();
      server.close();
      return;
    }
    const check = await Admin.findOne({ superAdmin: true });
    if (check) {
      console.log("Super user already set up");
      mongoose.disconnect();
      server.close();
      return;
    }
    const admin = await Admin.create({
      superAdmin: true,
      name,
      email,
      password,
    });
    console.log("Super user set up. Continue with the setup");
    mongoose.disconnect();
    server.close();
  } catch (error) {
    console.log("Something went wrong");
  }
};

setup();
