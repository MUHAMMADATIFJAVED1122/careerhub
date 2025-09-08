import mongoose from "mongoose";

// Sub-schema for comments
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    image: { type: String, default: null }, // optional image URL
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // NEW FIELDS
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who liked
    comments: [commentSchema], // comments array
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
