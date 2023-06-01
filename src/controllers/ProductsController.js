const { validationResult } = require("express-validator");
const { Pack, Product } = require("../models");

const ProductsController = {
  productsValidation: async (req, res) => {
    try {
      const packs = await Pack.findAll();
      return res.json({ data: packs });
      // const formValidation = validationResult(req);
      // if (formValidation.errors.length > 0) {
      //   return res.json({ errors: formValidation.mapped(), old: req.body });
      // }
      // const { product_code } = req.body;
      // res.json({ product_code });
    } catch (error) {
      if (error.name === "SequelizeConnectionRefusedError") {
        return res.status(500).json({
          error: true,
          message: "Sistema indisponível, tente novamente mais tarde!",
        });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json(error.parent.sqlMessage);
      }
    }
  },
};

module.exports = ProductsController;
