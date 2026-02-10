// import { db, auth } from "../db/connectToFirebaseDB.js";
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
    // https://avatar-placeholder.iran.liara.run/document
  } catch (error) {}
};

export const login = (req, res) => {
  console.log("Login user route");
  res.send("Login route");
};
export const logout = (req, res) => {
  console.log("Logout user route");
  res.send("Logout route");
};
