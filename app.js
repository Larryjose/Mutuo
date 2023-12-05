
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
require("dotenv").config();

const url_mongo = process.env.URL_MONGO_MUTUO;
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;

app.get("/",(req,res)=> res.sendFile(__dirname + "/login.html"))


app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // 1. Conectarse a la base de datos.
  // 2. Obtener todos los registros de la colección users donde el email coincida
  // 3. Si encuentra alguno
    // 3.1. Comparar la contraseña del usuario que trajo de la base de datos con la que nos llega del front
    // 3.2. Si coincide, retornar un token (expiración, etc)
  // 4. Si no encuentra alguno
    // 4.1 Retornar un error diciendo que no se encontró un usuario con dicho email

  // Debería ser loginUser({ email, password })
  const response = await loginUser({ email, password })
  
  if (response) {
    res.send({
      statusCode: 200,
      message: "El usuario inició sesión correctamente",
      ok: true
    });
  } else {
    res.send({
      statusCode: 404,
      message: "El email o contraseña son incorrectos",
      ok: false
    });
  };
});


// app.post("/register", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   createUser({ email, password });

//   console.log("Email:", email);
//   console.log("Contraseña:", password);

//   res.send("Datos recibidos en el servidor");
// });

app.listen(PORT, () => {
  console.log(`Servidor express en ejecución en http://localhost:${PORT}`);
});

const client = new MongoClient("mongodb+srv://larry:larryg@cluster0.gxdbzdx.mongodb.net/?retryWrites=true&w=majority");


async function createUser(body) {
  const { email, password } = body;

  try {
    await client.connect();

    const database = client.db();

    const collection = database.collection("users");

    const documento = {
      nombre: "Test",
      apellido: "Test",
      username: "test1",
      email: email,
      password: password
      // Agrega más campos según sea necesario
    };

    try {
      // Insertar el documento en la colección
      const resultado = await collection.insertOne(documento);
  
      console.log(`Registro insertado con éxito. ID del nuevo documento: ${resultado.insertedId}`);
    } catch (error) {
      console.error('Error al insertar el registro:', error);
    } finally {
      // Cerrar la conexión después de insertar el registro
      await client.close();
    }

    console.log("Conectado");
  } catch (error) {
    console.log(error);
  }  
}

async function loginUser(body) {
  const { email: emailFront, password } = body;

  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection("users");

    const criterioEmail = {
      email: emailFront
    };

    try {
      // Buscar un solo documento que cumpla con el criterio
      const resultado = await collection.findOne(criterioEmail);
  
      if (resultado) {
        if (resultado.password === password) {
          return true;
        } else {
          return false;         
        }
      } else {
        console.log('No se encontraron registros que cumplan con el criterio.');
      }
    } catch (error) {
      console.error('Error al buscar el registro:', error);
    } finally {
      await client.close();
    }

    console.log("Conectado");
  } catch (error) {
    console.log(error);
  }  
}




