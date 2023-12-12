// -------------------------------------
// importamos librerias que vamos a usar
// -------------------------------------
const express = require("express");
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
require("dotenv").config();

const url_mongo = process.env.URL_MONGO_MUTUO;
const bodyParser = require("body-parser");
const path = require("path");

const {
  enviarBienvenida,
  enviarAlertaDeMensaje,
  enviarMensajeDeUsuarioParaMutuo,
} = require('./mailHandler');

// -------------------------------------
// Mongoose
// -------------------------------------

mongoose.set('strictQuery', false)
function conectarDB(url) {
  return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
const User = mongoose.model('Users', {
  nombre: String,
  password: String,
  apellido: String,
  email: String,
  dni: String,
  telefono: String,
  direccion: String,
  cp: String
});

// -------------------------------------
// Passport
// -------------------------------------

// Estrategia para loguearse  
passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
function (req, username, password, done) {
  // check in mongo if a user with nombre exists or not
  User.findOne({ 'email': username })
    .then(user => {
      // Username does not exist, log error & redirect back
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false, console.log('message', 'User Not found.'));
      }

      // User exists but wrong password, log the error 
      if (user.password !== password) {
        console.log('Invalid Password');
        return done(null, false, console.log('message', 'Invalid Password'));
      }

      // User and password both match, return user from 
      // done method which will be treated like success
      return done(null, user);
    })
    .catch(err => {
      // In case of any error, return using the done method
      console.error('Error in findOne:', err);
      return done(err);
    });
  })
);

// Estrategia para registrar usuarios 

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
  // Esta funcion requiere siempre recibir req, username y password. 
  // No importa si se escribe como parametro "username" en la funcion
  // va a tomar el username recibido desde el post y si no existe
  // no entra en la funcion y redirige a failureRedirect
  function (req, username, password, done) {
    findOrCreateUser = function () {
      // find a user in Mongo with provided username
      console.log("Entra en la funcion de signup")
      User.findOne({ 'nombre': username })
      .then(user => {
        // ya existe
          console.log("Entra then del User.findOne")
          if (user) {
            console.log('User already exists');
            return done(null, false, console.log('message', 'User Already Exists'));
          } else {
            // if there is no user with that username
            // create the user
            var newUser = new User();
            // set the user's local credentials 
            
            console.log("--- Registros que se guardan  ---")

            console.log(username)
            newUser.nombre = username
            console.log(req.body.password)
            newUser.password = req.body.password

            console.log(req.body.apellido)
            newUser.apellido = req.body.apellido
            console.log(req.body.email)
            newUser.email = req.body.email
            console.log(req.body.dni)
            newUser.dni = req.body.dni
            console.log(req.body.telefono)
            newUser.telefono = req.body.telefono
            console.log(req.body.direccion)
            newUser.direccion = req.body.direccion
            console.log(req.body.cp)
            newUser.cp = req.body.cp

            console.log("--- Registros que se guardan  ---")

            // save the user
            return newUser.save()
              .then(savedUser => {
                console.log('Se registra exitosamente! ');
                return done(null, savedUser);
              })
              .catch(saveError => {
                console.log('Error al guardar el usuario:', saveError);
                return done(saveError);
              });
          }
        })
        .catch(err => {
          // In case of any error, return using the done method
          console.log('Error en findOne:', err);
          return done(err);
        });
    };

    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);

// Passport necesita esto
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id).exec()
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configs de las sessions
app.use(session({
  secret: 'keyboard cat',
  // httpOnly: false,
  // rolling: true,
  // maxAge: config.TIEMPO_EXPIRACION
  cookie: {
      // maxAge: 1000 * 60 * 60 * 24 // 1 dia
  },
  resave: true,
  secure: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


const PORT = 3000;

function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/error");
  }
}


// -------------------------------------
// Endpoints
// -------------------------------------
app.post("/contacto", (req,res) => {
  enviarMensajeDeUsuarioParaMutuo(req.body.email, req.body.message)
  res.redirect("/contact.html")
})

app.post("/busqueda", async (req, res) => {
  console.log(req.body)
})
app.post('/login',  passport.authenticate('login', { failureRedirect: '/contact.html' ,successRedirect: '/blog.html'}), (req, res, next) => {
  console.log("--- login ---")
  console.log(req.user.username)
  console.log(req.user.password)
  console.log("--- login ---")
});
app.post('/registrar',  passport.authenticate('signup', { failureRedirect: '/contact.html' ,successRedirect: '/blog.html'}), (req, res, next) => {
  console.log("--- register ---")
  console.log(req.user.nombre)
  console.log(req.user.apellido)
  console.log(req.user.dni)
  console.log(req.user.telefono)
  console.log(req.user.direccion)
  console.log(req.user.cp)
  console.log(req.user.email)
  console.log(req.user.contrasena)
  console.log("--- register ---")
});

conectarDB(url_mongo)
  .then(() => {
    console.log('BASE DE DATOS CONECTADA');

    app.listen(PORT, function(err) {
      if (err) return console.log('error en listen server', err);
      console.log(`Server running on PORT http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log('error en conexión de base de datos', err));


// app.post("/register", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   createUser({ email, password });

//   console.log("Email:", email);
//   console.log("Contraseña:", password);

//   res.send("Datos recibidos en el servidor");
// });


// ------------------------------
// Coneccion usando "MongoDB"
// ------------------------------



app.post("/login2", async (req, res) => {
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

    console.log("Conectado!");
  } catch (error) {
    console.log(error);
  }  
}

async function loginUser(body) {
  const { email: emailFront, password } = body;
  console.log(`${body.email}`)

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
      console.log(`${resultado}`)
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
    
    console.log("Conectado!!");
  } catch (error) {
    console.log(error);
  }  
}




