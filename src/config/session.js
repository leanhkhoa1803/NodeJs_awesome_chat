const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const configSession = (app) => {
  app.use(
    session({
      key: "express.sid",
      secret: "mySecret",
      store: MongoStore.create({
        mongoUrl: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      }),
      resave: true,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
  );
};

module.exports = configSession;
