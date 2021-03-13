const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/config/connectDB");
const configViewEngine = require("./src/config/viewEngine");
const initRoutes = require("./src/routes/web");
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");
const session = require("./src/config/session");
const passport = require("passport");
const socketio = require("socket.io");
const initSockets = require("./src/sockets/index");

const cookieParser = require("cookie-parser");
const { configSocketIo } = require("./src/config/socketio");
const { isBuffer } = require("lodash");

//Init app
const app = express();

//init server with socket.io and express
const server = http.createServer(app);
let io = socketio(server);
//config .env
dotenv.config();

//connect DB
connect();

//configSession
session.config(app);
//config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));
//Enable flash message
app.use(connectFlash());

//use cookieParse
app.use(cookieParser());

//config passport
app.use(passport.initialize());
app.use(passport.session());

//init router
initRoutes(app);

//config io
configSocketIo(io, cookieParser, session.sessionStore);
//init sockets
initSockets(io);

server.listen(process.env.PORT, () => {
  console.log(`Server is running port ${process.env.PORT}`);
});
