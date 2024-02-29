import express from "express";
import { config } from "dotenv";
import expressAsyncErrors from "express-async-errors";

import connectDB from "../db/connect";
import productRouter from "../routes/products.js";
import notFoundMiddleware from "../middleware/not-found";
import errorMiddleware from "../middleware/error-handler";

config();

const app = express();
//middleware
app.use(express.json());
app.use(notFoundMiddleware);
app.use(errorMiddleware);

//routes

app.get(`/`, (req, res) => {
  res.send(
    `<h1>Store Product</h1><a href="/api/v1/products">Product route</a>`
  );
});
app.use(`/api/v1/products`, productRouter);
//Product middleware

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.Port || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    // connect db
    app.listen(port, console.log(`Server is listening ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
