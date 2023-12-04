document.addEventListener("DOMContentLoaded", async () => {
  const mensajeError = document.getElementsByClassName("error")[0];

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: email,
            password,
          }),
        });

        if (!res.ok) {
          console.error("Error en la solicitud:", res.status, res.statusText);
          return mensajeError.classList.toggle("escondido", false);
        }

        const resJson = await res.json();

        if (resJson.redirect) {
          // Almacenar el token en el almacenamiento local (localStorage)
          localStorage.setItem("token", resJson.token);
          window.location.href = resJson.redirect;
        }
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
        // Manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
      }
    });
});
