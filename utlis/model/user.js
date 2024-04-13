import mongoose, { Schema, models } from "mongoose";

const userSChema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String },
  email: { type: String, required: true },
  image: { type: String, required: true, default: "https://res.cloudinary.com/geekysrm/image/upload/v1542221619/default-user.png" },
});

const userModal = models.user || mongoose.model("user", userSChema);

export default userModal;
