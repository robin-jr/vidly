const express = require("express");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();
const Fawn = require("fawn");
const { schema, Rental } = require("../models/rental");
const mongoose = require("mongoose");
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find()
    .sort("-dateOut")
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findById(req.body.customerId).catch((r) => {
    return res.status(401).send("Customer with the given id not found");
  });
  if (!customer)
    return res.status(401).send("Customer with the given id not found");

  const movie = await Movie.findById(req.body.movieId).catch((r) => {
    return res.status(401).send("Movie with the given id not found");
  });
  if (!movie) return res.status(401).send("Movie with the given id not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is not in the stock");

  const rental = await new Rental({
    customer: {
      _id: customer.id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    await new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    return res.send(rental);
  } catch (ex) {
    console.log("Internal server error: ", ex);
    return res.status(500).send("Something failed");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id).catch((r) => {
    return res.status(401).send("rental not found :(");
  });
  if (!rental)
    return res.status(400).send("rental not found with the given id :(");
  res.send(rental);
});
router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id).catch((r) => {
    return res.status(401).send("rental not found");
  });
  if (!rental)
    return res.status(400).send("rental not found with the given id :(");

  res.send(rental);
});
router.put("/:id", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findById(req.body.customerId).catch((r) => {
    return res.status(401).send("Customer with the given id not found");
  });
  if (!customer)
    return res.status(401).send("Customer with the given id not found");

  const movie = await Movie.findById(req.body.movieId).catch((r) => {
    return res.status(401).send("Movie with the given id not found");
  });
  if (!movie) return res.status(401).send("Movie with the given id not found");

  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        customer: {
          _id: customer.id,
          name: customer.name,
          isGold: customer.isGold,
          phone: customer.phone,
        },
        movie: {
          _id: movie.id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      },
    },
    { new: true }
  ).catch((r) => {
    return res.status(400).send("rental not found with the given id");
  });
  if (!rental)
    return res.status(400).send("rental not found with the given id :(");

  res.send(rental);
});

module.exports = router;
