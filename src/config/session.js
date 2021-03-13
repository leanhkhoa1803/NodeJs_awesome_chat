const session = require("express-session");
const MongoStore = require("connect-mongo").default;

let sessionStore = new MongoStore({
  mongoUrl: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
});
const config = (app) => {
  app.use(
    session({
      key: process.env.SESSION_KEY,
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
  );
};

module.exports = {
  config: config,
  sessionStore: sessionStore,
};
