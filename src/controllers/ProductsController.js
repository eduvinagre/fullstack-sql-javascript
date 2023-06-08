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
      // Validacao do novo preço
      const osDezPorCentoDoValor = (10 * salesPrice) / 100;
      const limiteInferior = salesPrice - osDezPorCentoDoValor;
      const limiteSuperior = salesPrice + osDezPorCentoDoValor;

      if (newPrice > limiteSuperior || newPrice < limiteInferior) {
        return res.status(400).json({
          errors: "O novo preço é maior ou menor do que 10% do preço atual",
        });
      }
      // Validação do formulario
      const productValidated = {
        codigo: product.code,
        nome: product.name,
        precoAtual: product.sales_price,
        novoPreco: newPrice,
      };
      return res.status(200).json({ data: productValidated });
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
  productsUpdate: async (req, res) => {
    try {
      const { product_code, new_price } = req.body;

      const product = await Product.findByPk(product_code, {
        include: {
          model: Pack,
          as: "pack",
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const verifyIfProductIsPack = await Pack.findOne({
        where: { pack_id: product.code },
      });

      // verificando se é um pacote
      if (verifyIfProductIsPack) {
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

        /*Verificando quantos porcentos cada produto representa no pacote e 
                    Verificando a representação do preço do conjunto de produtos no pacote*/
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

        return res.status(200).json({ message: "preço do produto atualizado" });
      }

      // verificando se produto faz parte de pacote
      if (product.pack.length > 0) {
        const productPacksArray = [];
        for (let index in product.pack) {
          const productPack = await Product.findOne({
            where: { code: product.pack[index].pack_id },
          });
          productPacksArray.push(productPack);
        }
        const productPackInfosArray = [];
        for (let pack of productPacksArray) {
          const packProductsInfos = await Pack.findAll({
            where: { pack_id: pack.code },
            include: [
              {
                model: Product,
                as: "product",
              },
            ],
          });
          const packInfos = {
            pack_code: pack.code,
            name: pack.name,
            cost_price: pack.cost_price,
            sales_price: pack.sales_price,
            products: packProductsInfos,
          };
          productPackInfosArray.push(packInfos);
        }
        // atualizando os valores do produto e do pacote
        async function updateProductAndPackValues() {
          let otherProductSetPriceRepresentionInPack = 0;
          let newPackValue = 0;
          for (let pack of productPackInfosArray) {
            for (let p of pack.products) {
              const newProductSetPriceRepresentationInPack = new_price * p.qty;
              if (p.product.name != product.name) {
                const productSalesPrice = Number(p.product.sales_price);
                otherProductSetPriceRepresentionInPack =
                  productSalesPrice * p.qty;
                newPackValue +=
                  otherProductSetPriceRepresentionInPack +
                  newProductSetPriceRepresentationInPack;
              }
              await Product.update(
                {
                  sales_price: new_price,
                },
                {
                  where: { code: product_code },
                }
              );
              await Product.update(
                {
                  sales_price: newPackValue,
                },
                {
                  where: { code: pack.pack_code },
                }
              );
            }
          }
        }
        await updateProductAndPackValues();
        return res.status(200).json({ message: "preço do produto atualizado" });
      }

      await Product.update(
        { sales_price: new_price },
        {
          where: { code: product_code },
        }
      );
      return res.status(200).json({ message: "preço do produto atualizado" });
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
