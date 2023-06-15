
// -- EXPRESS --
const express = require("express");
const router = express.Router();


// -- IMPORTAÇÕES --
const validationMiddleware = require("../middlewares/validationMiddleware");
const ProductsController = require("../controllers/ProductsController");


// -- MIDDLEWARES --
const validator = validationMiddleware;


// -- ROTAS --
router.post("/api/v1/shopper/validation", validator, ProductsController.productsValidation);//rota: validações
router.post("/api/v1/shopper/update", ProductsController.productsUpdate);//rota: atualização das infos do produto



module.exports = router;
