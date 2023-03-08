require("dotenv").config();
require("express-async-errors");
const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const errorHandler = require("./middlewares/errorHandler");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Routes
app.use("/api/user", userRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on PORT ${PORT}`);
});
