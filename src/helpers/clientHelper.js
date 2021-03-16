const moment = require("moment");
exports.bufferToBase64 = (bufferFrom) => {
  return Buffer.from(bufferFrom).toString("base64");
};

exports.getLastItemOfArray = (array) => {
  if (!array.length) {
    return [];
  }
  return array[array.length - 1];
};

exports.covertTimeStamp = (timeStamp) => {
  if (!timeStamp) {
    return "";
  }
  return moment(timeStamp).locale("vi").startOf("seconds").fromNow();
};
