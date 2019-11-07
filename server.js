const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const messagingRoutes = require("./routes/messaging");
const password = process.env.DB_PASSWORD;

const app = express();

//Log all request
app.use(morgan("dev"));
//////////////////

// Compress all request and responses to enhance performance
app.use(compression());
///////////////////////////////////////////////////////////

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//////////////////////////////////////////////

//Handle CORS for single page application access
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});
//////////////////////////////////////////////////////////////////////////////

//Routes that handle all incoming requests
app.use("/products", productRoutes);
app.use("/messaging", messagingRoutes);

/////////////////////////////////////////

//Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});
////////////////////////////////////////////

//Connect to Mongo Atlas Cloud DB
mongoose.connect(
  "mongodb+srv://:" +
    password +
    "@cluster0-th6lt.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;
/////////////////////////////////////////////

//Start server
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listeting on port ${port} ....`));
/////////////////////////////
