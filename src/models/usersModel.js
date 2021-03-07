const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: { type: String },
    isActive: { type: Boolean, default: false },
    verifyToken: { type: String },
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  findByUserId(id) {
    return this.findOne({ _id: id }).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },
  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },
  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  updateUser(id, item) {
    return this.findOneAndUpdate({ _id: id }, item).exec();
  },

  updatePassword(id, item) {
    return this.findOneAndUpdate(
      { _id: id },
      { "local.password": item }
    ).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

module.exports = mongoose.model("user", UserSchema);
