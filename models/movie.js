const Joi = require("joi");
const mongoose = require("mongoose");

const { mongSchema: genreSchema, schema: genreSchemaJoi } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    maxlength: 50,
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0 },
  dailyRentalRate: { type: Number, required: true, min: 0 },
});

const Movie = mongoose.model("Movies", movieSchema);

const schema = Joi.object({
  title: Joi.string().min(1).required().max(50),
  genre: Joi.objectId().required(),
  numberInStock: Joi.number().required().min(0),
  dailyRentalRate: Joi.number().min(0).required(),
});

exports.Movie = Movie;
exports.schema = schema;
