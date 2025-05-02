import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js"
//import reportRoutes from "./routes/reportRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { connectDb } from "./config/db.js";

const app=express();

app.use(
    cors({
        origin:process.env.CLIENT_URL || "*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],

    })
)

app.use(express.json());

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
//app.use("/api/reports",reportRoutes);

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>
   console.log(`server running on port ${PORT}`)
);