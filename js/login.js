function handleLogin() {
    const loginForm = document.getElementById("login-form");
    const messageElement = document.getElementById("message");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email-input").value.trim();
        const password = document.getElementById("password-input").value.trim();

        try {
            const response = await fetch("/database.json");
            if (!response.ok) throw new Error("Error al cargar la base de datos.");

            const data = await response.json();
            const user = data.users.find(u => u.email === email && u.password === password);

            if (user) {
                sessionStorage.setItem("loggedInUser", user.id);
                window.location.href = "index.html";
            } else {
                messageElement.textContent = "Usuario o contraseña incorrectos";
                messageElement.style.color = "#CD4D4D";
                messageElement.style.display = "block";
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            messageElement.textContent = "Ocurrió un error. Inténtalo de nuevo.";
            messageElement.style.color = "#CD4D4D";
            messageElement.style.display = "block";
        }
    });
}
