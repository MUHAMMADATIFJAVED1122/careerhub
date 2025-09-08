// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const UserSchema = new Schema({
// //   timestamps: true,
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
  
// });

// const User = mongoose.model("User", UserSchema);

// module.exports = User;



const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ✅ New optional profile fields
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String, // store image URL (later can use Cloudinary)
      default: "",
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    // ✅ Add followers & following
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
