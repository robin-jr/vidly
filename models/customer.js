const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customers",
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: Number, required: true, minlength: 5, maxlength: 12 },
  })
);
const schema = Joi.object({
  name: Joi.string().min(3).required().max(50),
  phone: Joi.number().min(5).required(),
  isGold: Joi.bool(),
});

exports.Customer = Customer;
exports.schema = schema;
