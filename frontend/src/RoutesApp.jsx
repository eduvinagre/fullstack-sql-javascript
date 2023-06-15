
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import UpdateProductInfosPage from "./pages/UpdateProductInfosPage";

function RoutesApp(){

     return(
          <BrowserRouter>
               <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/atualizacao" element={<UpdateProductInfosPage/>}/>
               </Routes>
          </BrowserRouter>
     );

}

export default RoutesApp;