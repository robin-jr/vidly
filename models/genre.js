const Joi = require("joi");
const mongoose = require("mongoose");

const schema = Joi.object({
  name: Joi.string().min(3).required().max(50),
});
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genres", genreSchema);

exports.schema = schema;
exports.Genre = Genre;
exports.mongSchema = genreSchema;
