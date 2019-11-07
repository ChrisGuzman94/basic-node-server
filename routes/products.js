const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../model/products");

// Get all existing products
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id
          };
        })
      };

      res.status(200).json(response);
    });
});

// Create new product
router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product Created",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
        error: error
      });
    });
});

// Find product by id
router.get("/:id", (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .select("name price _id")
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc
        });
      } else {
        res.status(500).json("Product cannot be found");
      }
    })
    .catch(error => console.log(error));
});

// Update product by id
router.patch("/:id", (req, res, next) => {
  const productId = req.params.id;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id: productId }, { $set: updateOps })
    .then(result => {
      res.status(200).json({
        message: "Product updated"
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: error
      });
    });
});

// Delete product by id
router.delete("/:id", (req, res, next) => {
  const productId = req.params.id;
  Product.findByIdAndDelete(productId)
    .then(doc => {
      console.log(response);
      if (doc) {
        res.status(200).json({
          message: "Product Deleted"
        });
      } else {
        res
          .status(500)
          .json("Product not found, make sure you provide the correct id");
      }
    })
    .catch(error => console.log(error));
});
module.exports = router;
