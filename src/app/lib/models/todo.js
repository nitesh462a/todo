import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true ,ref: "User"},

  text: String,
  completed: Boolean,
});

export const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
