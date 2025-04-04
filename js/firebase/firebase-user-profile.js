import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
const db = getFirestore(app);
fetch('/templates/profile.html')
    .then(response => response.text())
    .then(template => {
        const profileContainer = document.getElementById('profile');
        profileContainer.innerHTML = template
    });

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = sessionStorage.getItem('loggedInUser');
    console.log(loggedInUserId)
    if (loggedInUserId) {
        const docRef = doc(db, 'users', loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('name').innerText = userData.name;
                    document.getElementById('username').innerText = userData.username;
                    document.getElementById('description').innerText = userData.description;
                    document.getElementById('description').src = userData.profilePicture;
                } else {
                    console.log("Error con el ID del usuario...")
                }
            }).catch((error) => {
            console.log("Error al obtener el documento ")
            console.log(error)
        })
    } else {
        console.log("UserId no encontrado")
    }

    const logoutButton = document.getElementById('logoutButton')
    logoutButton.onclick = function() {
        sessionStorage.removeItem('loggedInUser');
        signOut(auth)
            .then(()=>{
                window.location.href = 'index.html';
            })
            .catch((error)=>{
                console.log("Error al cerrar sesión")
            })
    };

})