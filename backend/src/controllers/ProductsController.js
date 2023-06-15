const { validationResult } = require("express-validator");
const { Pack, Product } = require("../models");
const verificarReajuste = require("../utils/verificarReajuste");
const productPorcentAndValueRepresentationInThePackFunction = require("../utils/productPorcentAndValueRepresentationInThePackFunction");

const ProductsController = {

     productsValidation: async (req, res) => {

          try {
               
               const { product_code, new_price } = req.body;
               console.log("Entrou no método");
               
               //validando campos dos formulários
               const formValidation = validationResult(req);
               console.log(formValidation.errors.length)
               if (formValidation.errors.length > 0) {
                    return res.status(404).json({ errors: formValidation.mapped(), old: req.body });
               }


               //buscando produto através do código enviado do frontend
               const product = await Product.findByPk(product_code, {
                    include: {
                         model: Pack,
                         as: "pack"
                    }
               });

               //verificando se o código do produto existe no banco de dados
               if(!product) {
                    return res.status(404).send({ errors: "O código do produto não existe." });
               }


               //verificando se o preço de venda é menor que o preço de custo
               const costPrice = Number(product.cost_price);
               if( new_price < costPrice){
                    return res.status(404).send({ errors: "O novo preço do produto não pode ser menor que o preço de custo." });
               }


               const salesPrice = Number(product.sales_price);
               const newPrice = Number(new_price);

               //Verificando se o reajuste é maior ou menor do que 10% do preço atual do produto.
               const resultado = verificarReajuste(salesPrice, newPrice);
               if(!resultado){
                    return res.status(400).send({ errors: "o reajuste NÃO pode ser maior ou menor do que 10% do preço atual do produto." });
               }

               const productValidated = {
                    codigo: product.code,
                    nome: product.name,
                    precoAtual: Number(product.sales_price),
                    novoPreco: Number(new_price)
               }


               return res.status(200).json({data: productValidated});

    

          } catch (error) {

               if (error.name === "SequelizeConnectionRefusedError") {
                    return res.status(500).json({
                         error: true,
                         message: "Sistema indisponível, tente novamente mais tarde!",
                    });
               }
               if (error.name === "SequelizeUniqueConstraintError") {
                    return res.status(400).json({error: true, message: error.parent.sqlMessage});
                    }

               if (error.name === "SequelizeValidationError"){
                    return res.status(400).json({error: true, message: `${error.errors[0].type} at ${error.errors[0].path}`});
               }
          }
     },

     productsUpdate: async (req, res) => {

          try {
               
               const { product_code, new_price } = req.body;

               //-- Buscando o produto através do código do produto(product_code) enviado do frontend --
               const product = await Product.findByPk(product_code, {
                    include: {
                         model: Pack,
                         as: "pack"
                    }
               });

               if(!product) {
                    return res.status(404).json({error: "Produto não encontrado."});
               }

               //-- Verificando se é um pacote --
               const verifyIfTheProductIsAPack = await Pack.findOne({
                    where: {pack_id: product.code}
               });

               //-- se a variável 'verifyIfTheProductIsAPack' não for null/undefined é um pacote --
               if(verifyIfTheProductIsAPack){

                    const packProductsInfos = await Pack.findAll({
                         where:{pack_id: product.code},
                         include:[{
                              model: Product,
                              as: "product"
                         }]
                    });


                    /*-- Verificando quantos porcentos cada produto representa no pacote e 
                    Verificando a representação do preço do conjunto de produtos no pacote --*/
                    const productPorcentAndValueRepresentationInThePackArray = productPorcentAndValueRepresentationInThePackFunction(product, packProductsInfos, new_price);
              
                    //-- Percorrendo o array para atualizar os preços dos produtos inseridos dentro do pacote --
                    for (let packProduct of productPorcentAndValueRepresentationInThePackArray) {
                         const newProductPrice = packProduct.product_set_price_representation_in_pack / packProduct.quantity_of_product_in_the_pack;
                         const productCode = packProduct.product_code;
                    
                         //-- Atualizando os preços dos produtos inseridos no pacote --
                         await Product.update(
                              {
                                   sales_price: newProductPrice
                              },
                              {
                                   where: { code: productCode }
                              }
                         );
                    }

                    //-- Atualizando o valor do pacote --
                    await Product.update({sales_price: Number(new_price)}, {where: {code: product_code}});
     
                    return res.status(200).json({ message: "Produto atualizado com sucesso"});
               }

               /*-- Verificando se o produto faz parte de algum pacote 
                    Se 'product.pack.length > 0' o produto faz parte de um ou mais pacotes--*/
               if(product.pack.length > 0){

                    //inserindo em um array, os pacotes em que o produto faz parte
                    let productPacksArray = [];
                    for(let index in product.pack){
                         
                         const productPack = await Product.findOne({
                              where: {code: product.pack[index].pack_id}
                         });

                         productPacksArray.push(productPack);
                    }


                    const productPackInfosArray = [];
                    for(let pack of productPacksArray){
                         const packProductsInfos = await Pack.findAll({
                              where:{pack_id: pack.code},
                              include:[{
                                   model: Product,
                                   as: "product"
                              }]
                         });

                         const packInfos = {
                              pack_code: pack.code,
                              name: pack.name,
                              cost_price: pack.cost_price,
                              sales_price: pack.sales_price,
                              products: packProductsInfos
                         }
                         productPackInfosArray.push(packInfos);
                    }


                    //atualizando os valores do produto e do pacote
                    async function updateProductAndPackValues(){

                         let otherProductSetPriceRepresentationInPack = 0;
                         let newPackValue = 0;
                         for(let pack of productPackInfosArray){
                              
                              for(let p of pack.products){

                                   const productNewSetPriceRepresentationInPack = new_price * p.qty;
                                   

                                   if(p.product.name != product.name){
                                        const productSalesPrice = Number(p.product.sales_price);
                                        otherProductSetPriceRepresentationInPack = productSalesPrice * p.qty;
                                        newPackValue += otherProductSetPriceRepresentationInPack + productNewSetPriceRepresentationInPack;                                       
                                   }

                                   //Atualizando o preço do produto 
                                   await Product.update({sales_price: new_price}, {where:{code: product_code}});
                                    
                              }

                              //Atualizando o preço do pacote
                              await Product.update({sales_price: newPackValue}, {where:{code: pack.pack_code}});                              
                         }
                              
                    }

                    await updateProductAndPackValues();

                    return res.status(200).json({ message: "Produto atualizado com sucesso"});
               }


               await Product.update({sales_price: new_price}, {where:{code: product_code}});
               
               

               return res.status(200).json({ message: "Produto atualizado com sucesso"});

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

               if (error.name === "SequelizeValidationError"){
                    return res.status(400).json({error: true, message: `${error.errors[0].type} at ${error.errors[0].path}`});
               }
          }
     }
};

module.exports = ProductsController;
