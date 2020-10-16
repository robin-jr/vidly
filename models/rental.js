const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      _id: { type: String, required: true },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 12,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      _id: { type: String, required: true },
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rentals", rentalSchema);

const schema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

exports.Rental = Rental;
exports.schema = schema;
