import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const usuarios = [
  {
    user: "larryjoseguarenas@gmail.com",
    password: "$2a$10$1etwJihTeA/A9gu47Q20ze4wXzLP3s19Njt8I0FXaaCqB8lmbV6Um", // Contraseña: 123456
  },
];

async function login(req, res) {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .send({ status: "Error", message: "Los campos están incompletos" });
  }

  const usuarioAResvisar = usuarios.find((usuario) => usuario.user === user);

  if (!usuarioAResvisar) {
    return res
      .status(400)
      .send({ status: "Error", message: "Error durante el inicio de sesión" });
  }

  const loginCorrecto = await bcryptjs.compare(
    password,
    usuarioAResvisar.password
  );

  if (!loginCorrecto) {
    return res
      .status(400)
      .send({ status: "Error", message: "Error durante el inicio de sesión" });
  }

  const token = jsonwebtoken.sign(
    { user: usuarioAResvisar.user },
    "secreto_super_secreto", // Aquí debes usar tu propia clave secreta
    { expiresIn: "1h" }
  );

  const cookieOption = {
    expires: new Date(
      Date.now() + 1 * 60 * 60 * 1000 // 1 hora de duración del token
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario logueado", redirect: "/admin" });
}

export default login;
