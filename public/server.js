const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("assets"));

// Ruta para autenticar al usuario
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Lógica de autenticación simulada
  if (email === "usuario@example.com" && password === "contrasena") {
    // Crear un token JWT
    const token = jwt.sign({ email }, "secreto_super_secreto", {
      expiresIn: "1h",
    });

    // Enviar el token al cliente
    res.json({ success: true, token, redirect: "/dashboard.html" });
  } else {
    // Autenticación fallida
    res
      .status(401)
      .json({ success: false, message: "Credenciales incorrectas" });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
