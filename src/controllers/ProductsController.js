const { validationResult } = require("express-validator");
const { Pack, Product } = require("../models");

const ProductsController = {
  productsValidation: async (req, res) => {
    try {
      const { product_code, new_price } = req.body;
      const formValidation = validationResult(req);
      // Validação do formulário (campos, preços preenchidos e numéricos)
      if (formValidation.errors.length > 0) {
        return res
          .status(400)
          .json({ errors: formValidation.mapped(), old: req.body });
      }
      const product = await Product.findByPk(product_code, {
        include: {
          model: Pack,
          as: "pack",
        },
      });
      // Validação se o código do produto existe
      if (!product) {
        return res
          .status(404)
          .json({ errors: "O código do produto não existe" });
      }
      // Validação do preço de custo
      const costPrice = Number(product.cost_price);
      const salesPrice = Number(product.sales_price);
      const newPrice = Number(new_price);
      if (newPrice < costPrice) {
        return res
          .status(400)
          .json({ errors: "O preço é menor do que o custo" });
      }
      const osDezPorCentoDoValor = (10 * salesPrice) / 100;
      const limiteInferior = salesPrice - osDezPorCentoDoValor;
      const limiteSuperior = salesPrice + osDezPorCentoDoValor;
      if (newPrice > limiteSuperior || newPrice < limiteInferior) {
        return res
          .status(400)
          .json({
            errors: "O novo preço é maior ou menor do que 10% do preço atual",
          });
      }
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
