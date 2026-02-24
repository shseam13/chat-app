import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import connectToFirebaseDB from "./db/connectToFirebaseDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//   // root route http://localhost:8000/
//   res.send("Hello world!!");
// });

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, () => {
//   connectToFirebaseDB();
//   console.log(`Server is running on port ${PORT}`);
// });
