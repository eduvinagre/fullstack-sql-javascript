import {useLocation, useNavigate} from "react-router-dom";
import "./UpdateProductInfosPage.css";
import axios from "axios";

const baseURL = "http://localhost:3000/api/v1/shopper/update";

function UpdateProductInfosPage(){

     const location = useLocation();
     const product = location.state.product;
     const navigate = useNavigate();
     console.log(location.state);

     async function handleSubmit(){
          try {
               const data = {
                    product_code: Number(product.codigo),
                    new_price: Number(product.novoPreco)
               }
               const resp = await axios.post(baseURL, data);
               
               console.log(resp.data.message);

               // eslint-disable-next-line no-undef
               Swal.fire({
                    title: resp.data.message,
                    showConfirmButton: false
               });
               setTimeout(()=>{
                    // eslint-disable-next-line no-undef
                    Swal.close()
               }, 2000);
               setTimeout(()=>{
                    navigate("/");
               },2500)
               
          } catch (error) {
               console.log(error);
          }
     }

     return(
          <div className="update-product-infos-page">
               <div className="wrapper-elements">
               <h1>Shopper</h1>
               <button onClick={handleSubmit}>Atualizar</button>
          </div>

          <br /> 

          <table border={1}>
               <thead>
                    <th>Código do Produto</th>
                    <th>Nome do Produto</th>
                    <th>Preço Atual</th>
                    <th>Novo Preço</th>
               </thead>
               <tbody>
                    <td>{product.codigo}</td>
                    <td>{product.nome}</td>
                    <td>{product.precoAtual}</td>
                    <td>{product.novoPreco}</td>
               </tbody>
          </table>
          </div>
     );
}

export default UpdateProductInfosPage;