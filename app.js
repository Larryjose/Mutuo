const express = require("express");
require("dotenv").config();

const url_mongo = process.env.URL_MONGO_MUTUO;
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("Email:", email);
  console.log("Contraseña:", password);

  res.send("Datos recibidos en el servidor");
});

app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en http://localhost:${PORT}`);
});
