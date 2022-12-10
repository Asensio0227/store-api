require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productsRoutes = require('./routes/products');

const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/errors-handler');

app.use(express.static('./public'))
app.use(express.json());

// app.use('/', (req, res) => {
//   res.status(200).send(`<h1>home</h1><a href="/api/v1/products">products</a>`);
// });

app.use('/api/v1/products', productsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // connect db
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}...`);
    })
  } catch (error) {
    console.log(error)
  }
}

start();