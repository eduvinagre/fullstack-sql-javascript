const { validationResult } = require("express-validator");
const { Pack, Product } = require("../models");

const ProductsController = {
  productsValidation: async (req, res) => {
    try {
      const { product_code, new_price } = req.body;

      //buscando produto através do código enviado do frontend
      const product = await Product.findByPk(product_code, {
        include: {
          model: Pack,
          as: "pack",
        },
      });

      //Verificando se é um pacote
      const verifyIfTheProductIsAPack = await Pack.findOne({
        where: { pack_id: product.code },
      });

      //se a variável 'verifyIfTheProductIsAPack' não for null é um pacote
      if (verifyIfTheProductIsAPack) {
        // return res.json({ message: "É um pacote." });

        const packProductsInfos = await Pack.findAll({
          where: { pack_id: product.code },
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        });
      }
      //Verificando quantos porcento cada produto representa no pacote e;
      //Verificando a representação do preço do conjunto de produtos no pacote
      const productPorcentAndValueRepresentationInThePackArray = [];
      for (let p of packProductsInfos) {
        const productSalesPrice = Number(p.product.sales_price);
        const productPorcentRepresentationInThePack =
          ((productSalesPrice * p.qty) / Number(product.sales_price)) * 100;

        const productSetPriceRepresentaioninPack =
          (productPorcentRepresentationInThePack / 100) * Number(new_price);

        const packProductInfos = {
          pack_name: product.name,
          pack_code: product.code,
          product_code: p.product.code,
          product_name: p.product.name,
          quantity_of_product_in_the_pack: p.qty,
          product_cost_price: Number(p.product.cost_price),
          product_sales_price: Number(p.product.sales_price),
          product_porcent_representation_in_pack: Number(
            productPorcentRepresentationInThePack.toFixed(2)
          ),
          product_set_price_representation_in_pack: Number(
            productSetPriceRepresentaioninPack.toFixed(2)
          ),
        };

        productPorcentAndValueRepresentationInThePackArray.push(
          packProductInfos
        );
      }
      //Atualizando os preços dos produtos inseridos dentro do pacote
      for (let packProduct of productPorcentAndValueRepresentationInThePackArray) {
        const newProductPrice =
          packProduct.product_set_price_representation_in_pack /
          packProduct.quantity_of_product_in_the_pack;
        const productCode = packProduct.product_code;

        console.log(newProductPrice, productCode);

        await Product.update(
          {
            sales_price: newProductPrice,
          },
          {
            where: { code: productCode },
          }
        );
      }

      //atualizando o valor do pacote
      await Product.update(
        { sales_price: Number(new_price) },
        { where: { code: product_code } }
      );

      return res.json(productPorcentAndValueRepresentationInThePackArray);
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
