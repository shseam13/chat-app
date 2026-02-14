import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import connectToFirebaseDB from "./db/connectToFirebaseDB.js";


const app = express();
const PORT = process.env.PORT || 5000;


dotenv.config();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  // root route http://localhost:8000/
  res.send("Hello world!!");
});


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, () => {
//   connectToFirebaseDB();
//   console.log(`Server is running on port ${PORT}`);
// });
