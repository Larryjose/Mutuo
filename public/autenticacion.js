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

  // Verificar las credenciales del usuario (aquí debes implementar tu lógica real de autenticación)
  if (email === "usuario@example.com" && password === "contrasena") {
    // Crear un token JWT
    const token = jwt.sign({ email }, "secreto_super_secreto", {
      expiresIn: "1h",
    });

    // Enviar el token al cliente
    res.json({ success: true, token });
  } else {
    // Autenticación fallida
    res.status(401).json({ success: false, message: "Credenciales incorrectas" });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
