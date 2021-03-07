const expressEjsExtend = require("express-ejs-extend");
const express = require("express");

//config view engine

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); //chua cac thu vien dc public ra ngoai view
  app.engine("ejs", expressEjsExtend); // cau hinh engine them expressEjsExtend
  app.set("view engine", "ejs"); // set view ung dung la ejs
  app.set("views", "./src/views"); //thiet lap duong dan den cac file giao dien
};
module.exports = configViewEngine;
