// import { db, auth } from "../db/connectToFirebaseDB.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // https://avatar-placeholder.iran.liara.run/document
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic
    })

    if (newUser) {
      await generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({ error: "Error creating user" });
    }

  } catch (error) {
    console.log("Error in signup route:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");
    if (!user || !isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    await generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log("Error in login route:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout route:", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
