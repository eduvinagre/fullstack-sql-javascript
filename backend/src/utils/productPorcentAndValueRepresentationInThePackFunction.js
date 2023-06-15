

function productPorcentAndValueRepresentationInThePackFunction(product, packProductsInfos, new_price) {
     const productPorcentAndValueRepresentationInThePackArray = [];
     
     for(let p of packProductsInfos){
          const productSalesPrice = Number(p.product.sales_price);
          const productPorcentRepresentationInThePack = ((productSalesPrice * p.qty) / Number(product.sales_price)) * 100;
          
          
          const productSetPriceRepresentaioninPack = (productPorcentRepresentationInThePack / 100) * Number(new_price);
          const packProductInfos = {
               pack_name: product.name,
               pack_code: product.code,
               product_code: p.product.code,
               product_name: p.product.name,
               quantity_of_product_in_the_pack: p.qty,
               product_cost_price: Number(p.product.cost_price),
               product_sales_price: Number(p.product.sales_price),
               product_porcent_representation_in_pack: Number(productPorcentRepresentationInThePack.toFixed(2)),
               product_set_price_representation_in_pack: Number(productSetPriceRepresentaioninPack.toFixed(2))
          }

          
          productPorcentAndValueRepresentationInThePackArray.push(packProductInfos);    
     }

     

     return productPorcentAndValueRepresentationInThePackArray;
}

module.exports = productPorcentAndValueRepresentationInThePackFunction;