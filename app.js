const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const authJwt = require("./helpers/jwt");

const api = process.env.API_URL;

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/upload", express.static(__dirname + "/public/upload"));
app.use(errorHandler);

//Routes
const productsRoutes = require("./routers/products");
const categoriesRoutes = require("./routers/categories");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "mern-shop",
  })
  .then(() => {
    console.log("connection ready");
  })
  .catch((err) => {
    console.log(err);
  });

//server
// app.listen(3000, () => {
//   console.log("server is running http://localhost:3000");
// });

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port" + port);
});
