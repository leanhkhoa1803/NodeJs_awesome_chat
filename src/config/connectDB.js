const mongoose = require("mongoose");

let connectDB = async () => {
  const URL = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  const connect = await mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("DB is connect");
    });
};
module.exports = connectDB;
