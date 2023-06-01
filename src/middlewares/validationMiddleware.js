const { check } = require("express-validator");

const validator = [
  check("product_code")
    .trim()
    .bail()
    .notEmpty()
    .withMessage("Código do produto não informado")
    .bail()
    .isNumeric()
    .withMessage("O campo deve ser preenchido com números"),

  check("new_price")
    .trim()
    .bail()
    .notEmpty()
    .withMessage("Produto não possui um preço")
    .bail()
    .isNumeric()
    .withMessage("O campo deve ser preenchido com números"),
];

module.exports = validator;
