const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const home = require("./routes/home");

const mongoose = require("mongoose");

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/", home);

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongodb...\n"))
  .catch(() => console.log("Couldn't connect to Mongodb :("));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
