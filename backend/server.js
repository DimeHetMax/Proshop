import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import products from "./data/products.js";
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const port = process.env.PORT || 8000
console.log(port);
connectDB()

const app = express();

// Body parser middleware

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser middleware
app.use(cookieParser())

app.use(cors())
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use(notFound)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${port}`);
})
