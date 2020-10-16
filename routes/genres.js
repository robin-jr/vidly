const express = require("express");
const router = express.Router();
const { Genre, schema } = require("../models/genre");

async function createGenre({ name }) {
  const newGenre = new Genre({
    name: name,
  });
  const result = await newGenre.save().catch((r) => {
    return r.message;
  });
  return result;
}

router.get("/", async (req, res) => {
  const genres = await Genre.find()
    .sort({ name: 1 })
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id).catch((r) => {
    return res.status(401).send("genre not found :(");
  });
  if (!genre)
    return res.status(400).send("genre not found with the given id :(");
  res.send(genre);
});

router.post("/", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = {
    name: req.body.name,
  };
  const r = await createGenre(genre).catch(() => {
    return res.send("Could not create genre");
  });
  res.send(r);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id).catch((r) => {
    return res.status(401).send("genre not found");
  });
  if (!genre)
    return res.status(400).send("genre not found with the given id :(");

  res.send(genre);
});
router.put("/:id", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { $set: { name: req.body.name } },
    { new: true }
  ).catch((r) => {
    return res.status(400).send("genre not found with the given id");
  });
  if (!genre)
    return res.status(400).send("genre not found with the given id :(");

  res.send(genre);
});

module.exports = router;
