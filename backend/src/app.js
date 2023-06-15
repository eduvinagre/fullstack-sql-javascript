const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const productsRoutes = require("./routes/productsRoutes");


app.use(cors());
app.use(express.json());

app.use(productsRoutes);

app.listen(port, () => {
  console.log("ouvi o servidor na 3000");
});
