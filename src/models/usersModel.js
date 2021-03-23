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
  findByUserIdToSession(id) {
    return this.findOne({ _id: id }, { "local.password": 0 }).exec();
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

  //deprecatedUserId : mang chua userId va contactId dung de loc cac Id khong ton tai tron mang de select
  findAllUserForAddContact(deprecatedUserId, keyword) {
    //tim tat ca user khong phai la ban be va thoa dieu kien tai khoan isActive va username or email is like
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecatedUserId } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": new RegExp(keyword, "i") },
              { "facebook.email": new RegExp(keyword, "i") },
              { "google.email": new RegExp(keyword, "i") },
            ],
          },
        ],
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },

  getDataByUserId(id) {
    return this.findOne(
      { _id: id },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },

  findAllAddGroupChat(friendIds, keyword) {
    //tim tat ca user khong phai la ban be va thoa dieu kien tai khoan isActive va username or email is like
    return this.find(
      {
        $and: [
          { _id: { $in: friendIds } },
          { "local.isActive": true },
          {
            $or: [
              { username: { $regex: new RegExp(keyword, "i") } },
              { "local.email": new RegExp(keyword, "i") },
              { "facebook.email": new RegExp(keyword, "i") },
              { "google.email": new RegExp(keyword, "i") },
            ],
          },
        ],
      },
      { _id: 1, username: 1, address: 1, avatar: 1 }
    ).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

module.exports = mongoose.model("user", UserSchema);
