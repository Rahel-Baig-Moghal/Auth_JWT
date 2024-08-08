import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profilepicture: String,
  refreshtoken: String
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
