// const express = require("express"); //rest api server
import { config } from "dotenv"; // imported config function
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
config(); // to read .env file
connectDB();
const app = express();

//body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//import routes
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
//use api routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
// app.get("/hello", (req, res) => {
//   //api endpoint/route
//   res.json({ message: "Hello world!" }); //json response sending
// });

const PORT = 5001; //port number
const server = app.listen(process.env.PORT || PORT, "0.0.0.0", () => {
  //server listening to reqs
  console.log(`Server running on port ${process.env.PORT}`);
});

//routes needed
//AUTH - signin, register
//movie - get all movies
//user - profile
//watchlist -

//ERROR HANDLING IN API(must)

//handles any unhandled promise rejections(db conn errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB(); //to prevent memory leaks while closing server
    process.exit(1);
  });
});

//handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught exception:", err);
  await disconnectDB();
  process.exit(1);
});

//graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM , shutting down");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
