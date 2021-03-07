const https = require("https");
const pem = require("pem");
const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/config/connectDB");
const configViewEngine = require("./src/config/viewEngine");
const initRoutes = require("./src/routes/web");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");
const configSession = require("./src/config/session");
const passport = require("passport");

//Init app
const app = express();
//config .env
dotenv.config();

//connect DB
connect();

//configSession
configSession(app);
//config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));
//Enable flash message
app.use(connectFlash());
//config passport
app.use(passport.initialize());
app.use(passport.session());

//init router
initRoutes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running port ${process.env.PORT}`);
});
