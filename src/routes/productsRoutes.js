const validationMiddleware = require("../middlewares/validationMiddleware");

const express = require("express");

const router = express.Router();

const ProductsController = require("../controllers/ProductsController");

const validator = validationMiddleware;

router.post(
  "/api/v1/shopper/validation",
  validator,
  ProductsController.productsValidation
);

module.exports = router;
