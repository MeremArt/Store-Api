require(`dotenv`).config();
require(`express-async-errors`);
//async error

const express = require(`express`);
const app = express();

const connectDB = require(`./db/connect`);
const ProductRouter = require(`./routes/products`);
const notFoundMiddleware = require(`./middleware/not-found`);
const errorMiddleware = require(`./middleware/error-handler`);

//middleware
app.use(express.json());

//routes

app.get(`/`, (req, res) => {
  res.send(
    `<h1>Store Product</h1><a href="/api/v1/products">Product route</a>`
  );
});
app.use(`/api/v1/products`, ProductRouter);
//Product middleware

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.Port || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // connect db
    app.listen(port, console.log(`Server is listening ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
