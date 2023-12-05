async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;



try {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  console.log(res); //  imprimir la respuesta en la consola

  if (!res.ok) {
    throw new Error(`Error en la solicitud: ${res.status} - ${res.statusText}`);
  }

  const resJson = await res.json();

  if (resJson.token) {
    // Almacenar el token en el almacenamiento local (localStorage)
    localStorage.setItem("token", resJson.token);

    // Redireccionar a la página especificada por el servidor
    if (resJson.redirect) {
      window.location.href = resJson.redirect;
    } else {
      // Redireccionar a una página predeterminada si no se especifica ninguna
      window.location.href = "/contact.html";
    }
  }
} catch (error) {
  console.error("Error en la solicitud:", error.message);
  // Manejar el error de manera adecuada, por ejemplo, mostrar un mensaje al usuario
}


}