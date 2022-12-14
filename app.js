require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectToDB = require("./db/db");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./docs.yaml");

// importing routers
const loginRouter = require("./routes/login");
const userDataRouter = require("./routes/user");
const adminDataRouter = require("./routes/admin");
const superAdminRouter = require("./routes/superAdmin");

// middleware
const errorHandler = require("./middleware/errorHandler");
const authorizeUser = require("./middleware/authenticateUser");
const authorizeAdmin = require("./middleware/authenticateAdmin");
const isAdmin = require("./middleware/isAdmin");
const isUser = require("./middleware/isUser");
const isSuper = require("./middleware/isSuper");
const handleMissingRoute = require("./middleware/catch404");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 1000,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// allows data to be processed as json in req.body
app.use(express.json());

// routers
app.use("/api/authorize", loginRouter);
app.use("/api/user", [authorizeUser, isUser], userDataRouter);
app.use("/api/admin", [authorizeAdmin, isAdmin], adminDataRouter);
app.use("/api/super", [authorizeAdmin, isSuper], superAdminRouter);

// testing route
app.get("/", (req, res) => {
  res.send("<h1>Hello There!</h1><a href='/docs'>API Documentation</a>");
});
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// middleware
app.use(errorHandler);
app.use(handleMissingRoute);

// port selection
const port = process.env.PORT || 5000;

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
