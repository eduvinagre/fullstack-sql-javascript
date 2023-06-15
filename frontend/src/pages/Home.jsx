import Papa from "papaparse"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";


const baseURL = "http://localhost:3000/api/v1/shopper/validation";

function Home() {

     
     // eslint-disable-next-line no-unused-vars
     const [columnArray, setColumn] = useState([]);
     const [values, setValues] = useState([]);
     const [productCode, setProductCode] = useState("");
     const [newPrice, setNewPrice] = useState("");
     const [error, setError] = useState("");
     

     // eslint-disable-next-line no-unused-vars
     const [product, setProduct] = useState("");

     const navigate = useNavigate();

  function handleFile(event){
     Papa.parse(event.target.files[0], {
          header: true,
          skipEmptyLines: true,
          complete: function(result){
               const columnArray = [];
               const valuesArray = [];

               result.data.map((d)=>{
                    columnArray.push(Object.keys(d));
                    valuesArray.push(Object.values(d));
               });
               setColumn(columnArray[0]);
               setValues(valuesArray);   
          }
     })
  }

  useEffect(() => {
     getValues();
   }, [values]);
 
   function getValues() {
     if (values.length > 0) {
       setProductCode(values[0][0]);
       setNewPrice(values[0][1]);
     }
   }

   useEffect(() => {
     if (product !== "") {
       navigate("/atualizacao", { state: { product } });
     }
   }, [product, navigate]);

  async function handleSubmit(){

     try {
          
          const data = {
               product_code: Number(productCode),
               new_price: Number(newPrice)
          }
          const resp = await axios.post(`${baseURL}`,
               data
          );
          setProduct(resp.data.data);
          console.log(product)
          // navigate("/atualizacao", {state: {product}});

     } catch (error) {
          if(error.response && error.response.data){
               const responseData = error.response.data;
               if(responseData.errors && responseData.errors.product_code && responseData.errors.product_code.msg){
                    console.log(error.response.data.errors.product_code.msg);
                    setError(error.response.data.errors.product_code.msg)
               }else if(responseData.errors && responseData.errors.new_price && responseData.errors.new_price.msg){
                    console.log(error.response.data.errors.new_price.msg);
                    setError(error.response.data.errors.new_price.msg)
               }else if(error.response.data && error.response.data.errors){
                    console.log(error.response.data.errors);
                    setError(error.response.data.errors)
               }
          }else{
               console.log(error);
               setError(error);
          }
          
     }
  }

  
  
  return (

     <main className="home">
          <div className="wrapper-elements">
               <h1>Shopper</h1>
               <input type="file" accept='.csv' name="file" onChange={handleFile} />
               <button onClick={handleSubmit}>Validar</button>
          </div>

          <br /> 

          {error && <div> <p  className="danger">{error}</p> </div>}

          {product == null ? "" : <div className="product">
               <p>{product.codigo}</p>
               <p>{product.nome}</p>
               <p>{product.precoAtual}</p>
               <p>{product.novoPreco}</p>
          </div>}  
          

          {/* <table>
               <thead>
                    <tr>
                         {columnArray.map((col, i) => (
                              <th key={i}>{col}</th>
                         ))}
                    </tr>
               </thead>
               <tbody>
                    {values.map((v, i) => (
                         <tr key={i}>
                              {v.map((value, i) => (
                                   <td key={i}>{value}</td>
                              ))}
                         </tr>
                    ))}
               </tbody>
          </table> */}
         
     </main>
  );
}

export default Home;
