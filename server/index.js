import express from "express";
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app=express();
const port=process.env.PORT || 3001;
const databaseUrl=process.env.DATABASE_URL

app.use(cors({
    origin: [process.env.ORIGIN],
    credentials:true,
}))

app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoutes);

const server=app.listen(port,()=>{
    console.log(`server is running at  http://localhost:${port}`);
})

mongoose.connect(databaseUrl).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err.message);
})