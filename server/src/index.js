const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(morgan("tiny"));
dotenv.config({ path: "./config.env" });

app.use(express.json());
// db
require("./db/db");
//cors
app.use(cors());
// router
const router = require("./router");
app.use(router);

// Middleware
const middleware = (req, res, next) => {
  console.log("Hello Middleware");
  next();
};
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
