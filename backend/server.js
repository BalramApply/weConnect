import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(postRoutes)
app.use(userRoutes)
app.use(express.static("uploads"))

app.use(express.json());

const start = async () =>{
    const connectDB = await mongoose.connect("mongodb+srv://bp673468:GZ1Yvd4wWBI6k0pq@cluster0.sfibgmc.mongodb.net/linkedin?retryWrites=true&w=majority&appName=Cluster0")

    app.listen(9090, () =>{
    console.log("Server is running on port 9090")
    })
}

start();



