function verificarReajuste(precoAtual, novoPreco) {

     const os10PorcentosDoValor = (10 * precoAtual) / 100; 

     const limiteInferior = precoAtual - os10PorcentosDoValor;
     const limiteSuperior = precoAtual + os10PorcentosDoValor;

     
     
     if (novoPreco > limiteSuperior || novoPreco < limiteInferior) {
       return false;  // Reajuste válido
     } else {
       return true;  // Reajuste inválido
     } 
   }

   module.exports = verificarReajuste;