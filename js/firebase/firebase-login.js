// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjtVjoxu643hLu5gGvP2nfN8W-xHwlmT4",
    authDomain: "ps15-a3d8e.firebaseapp.com",
    projectId: "ps15-a3d8e",
    storageBucket: "ps15-a3d8e.firebasestorage.app",
    messagingSenderId: "906066723108",
    appId: "1:906066723108:web:23ebe8fbd2a191f404f3b1",
    measurementId: "G-10J2X8T2DD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const observer = new MutationObserver(() => {
    const submit = document.getElementById('login-button');
    if (submit) {
        submit.addEventListener("click", function (event) {
            event.preventDefault();

            const email = document.getElementById("email-input").value.trim();
            const password = document.getElementById("password-input").value.trim();

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    sessionStorage.setItem("loggedInUser", user.uid);
                }).then(()=>{
                    window.location.href = "index.html"
                })
                .catch((error) => {
                    const messageElement = document.getElementById("message");
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    messageElement.textContent = "Usuario o contraseña incorrectos";
                    messageElement.style.color = "#CD4D4D";
                    messageElement.style.display = "block";
                    // ..
                });
        });
        observer.disconnect(); // Detener la observación una vez encontrado
    }
});

observer.observe(document.body, { childList: true, subtree: true });