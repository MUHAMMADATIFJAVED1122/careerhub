import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
    });
    await client.connect();
  }
}

export async function signup(req, res) {
      console.log("Signup body:", req.body); 
  const { username, password, email } = req.body;
  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { username, password: hashedPassword, email };
    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId.toString() },   // ✅ fixed
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: result.insertedId.toString() });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).send("Server error");
  }
}

export async function login(req, res) {
  console.log("Login body received:", req.body); 
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id.toString() });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error!");
  }
}





// Example: user.controller.js
// import User from "../models/user.model.js";

// export const getProfile = async (req, res) => {
//   try {
//     res.json({
//       message: "User profile fetched successfully",
//       user: req.user, // already attached in middleware
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };
