const express = require("express");
const router = express.Router();
const { schema, Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find()
    .sort("name")
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(customers);
});

router.post("/", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  })
    .save()
    .catch((r) => {
      return res.send(r.message);
    });
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id).catch((r) => {
    return res.status(401).send("customer not found :(");
  });
  if (!customer)
    return res.status(400).send("customer not found with the given id :(");
  res.send(customer);
});
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id).catch(
    (r) => {
      return res.status(401).send("customer not found");
    }
  );
  if (!customer)
    return res.status(400).send("customer not found with the given id :(");

  res.send(customer);
});
router.put("/:id", async (req, res) => {
  const result = schema.validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  ).catch((r) => {
    return res.status(400).send("customer not found with the given id");
  });
  if (!customer)
    return res.status(400).send("customer not found with the given id :(");

  res.send(customer);
});

module.exports = router;
