const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();
const { schema, Movie } = require("../models/movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find()
    .sort("title")
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(movies);
});

router.post("/", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genre).catch((r) => {
    return res.status(401).send("Genre with the given id not found");
  });
  if (!genre) return res.status(401).send("Genre with the given id not found");

  const movie = await new Movie({
    title: req.body.title,
    genre: {
      _id: genre.id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  })
    .save()
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id).catch((r) => {
    return res.status(401).send("movie not found :(");
  });
  if (!movie)
    return res.status(400).send("movie not found with the given id :(");
  res.send(movie);
});
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id).catch((r) => {
    return res.status(401).send("movie not found");
  });
  if (!movie)
    return res.status(400).send("movie not found with the given id :(");

  res.send(movie);
});
router.put("/:id", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genre).catch((r) => {
    return res.status(401).send("Genre with the given id not found");
  });
  if (!genre) return res.status(401).send("Genre with the given id not found");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        genre: genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true }
  ).catch((r) => {
    return res.status(400).send("movie not found with the given id");
  });
  if (!movie)
    return res.status(400).send("movie not found with the given id :(");

  res.send(movie);
});

module.exports = router;
