const mongoose = require("mongoose");
const {
  addPost,
  removePost,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  addChat,
  removeChat,
} = require("./user.method");

//define schema
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    profile_id: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    bio: { type: String },
    password: { type: String },
    profile_img: { type: String },
    status: {
      type: String,
      enum: ["active", "suspended", "under review", "deleted"],
      default: "active",
    },
    provider: {
      type: String,
      enum: ["google", "instagram", "facebook"],
      required: true,
    },
    followers_count: { type: Number, dafault: 0 },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following_count: { type: Number, default: 0 },
    follwing: [{ type: Schema.Types.ObjectId, ref: "User" }],
    posts_count: { type: Number, default: 0 },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    chats_count: { type: Number, default: 0 },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("find", function () {
  this.where({ is_deleted: false });
});

// Methods
userSchema.statics.addPost = addPost;
userSchema.statics.removePost = removePost;
userSchema.statics.addFollower = addFollower;
userSchema.statics.removeFollower = removeFollower;
userSchema.statics.addFollowing = addFollowing;
userSchema.statics.removeFollowing = removeFollowing;
userSchema.statics.addChat = addChat;
userSchema.statics.removeChat = removeChat;

module.exports.userSchema = userSchema;