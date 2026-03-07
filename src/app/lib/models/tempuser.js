import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

const Temp = mongoose.models.TempUser || mongoose.model("TempUser", tempUserSchema);
export default  Temp;