import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

import {
    doc,
    getDoc,
    getFirestore
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js'; // Import Firestore


const firebaseConfig = {
    apiKey: "AIzaSyB0gh9Hq5JXTEmeqvsJHLVQULdH1W7YffM",
    authDomain: "nexus-5c53d.firebaseapp.com",
    projectId: "nexus-5c53d",
    storageBucket: "nexus-5c53d.appspot.com",
    messagingSenderId: "208164583979",
    appId: "1:208164583979:web:8fd62a5c315fe50ad7486e",
    measurementId: "G-WENGRWS7N9"
  };

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);  // Inicialización de Firestore

// Crear una función para mostrar el loader dentro del SweetAlert2
const showLoaderInSwal = () => {
    const style = document.createElement("style");
    style.innerHTML = 
    `
     
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  height: 110px;
  width: 110px;
  animation: rotate_3922 1.2s linear infinite;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.container span {
  position: absolute;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.container span:nth-of-type(1) {
  filter: blur(5px);
}

.container span:nth-of-type(2) {
  filter: blur(10px);
}

.container span:nth-of-type(3) {
  filter: blur(25px);
}

.container span:nth-of-type(4) {
  filter: blur(50px);
}

.container::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: #fff;
  border: solid 5px #ffffff;
  border-radius: 50%;
}

@keyframes rotate_3922 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@import 'sweetalert2/src/variables';

$swal2-dark-theme-black:rgba(25, 25, 26, 0);
$swal2-dark-theme-white:rgba(225, 225, 225, 0);
$swal2-outline-color: lighten($swal2-outline-color, 10%);

$swal2-background: $swal2-dark-theme-black;
$swal2-html-container-color: $swal2-dark-theme-white;
$swal2-title-color: $swal2-dark-theme-white;
$swal2-backdrop: rgba($swal2-dark-theme-black, .75);

        
    `;
    document.head.appendChild(style);
};
showLoaderInSwal();
// Manejo del inicio de sesión
document.getElementById('login').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevenir el envío del formulario de manera normal

    //Creativo el pana y Tio Pt
    
    //Fin creatividad

    const email = document.getElementById('emaillog').value;
    const password = document.getElementById('passwordlog').value;
    //Swal de carga
      Swal.fire({
        html: `
        
            <div class="container">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            </div>`,

        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
                        try {
                        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                       

                        // Verificar si ya tiene un rol asignado
                        const user = userCredential.user;
                        const userRef = doc(db, "users", user.uid);  // Referencia al documento del usuario
                        const userDoc = await getDoc(userRef);  // Obtener el documento
                            Swal.close();
                        if (userDoc.exists() && userDoc.data().role) {
                            var role = userDoc.data().role;
                            // Redirigir según el rol
                            if (role === "profesor") {
                                window.location.href = "prfesor.html";
                            } else if (role === "student") {
                                window.location.href = "/pagina_estudiante.html";
                            }else {
                                window.location.href = "roles.html";
                            }
                        } else {
                            window.location.href = "roles.html";
                        }

                      
                    } catch (error) {
                        Swal.close();
                        let errorMessage = '';
                        switch (error.code) {
                            case 'auth/wrong-password':
                                errorMessage = 'Contraseña incorrecta.';
                                break;
                            case 'auth/user-not-found':
                                errorMessage = 'Usuario no encontrado.';
                                break;
                            case 'auth/invalid-email':
                                errorMessage = 'Correo electrónico no válido.';
                                break;
                            default:
                                errorMessage = 'Error desconocido: ' + error.message;
                        }
        
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorMessage
                        });
                    }
                }
            });
        });
// Cerrar sesión
document.getElementById('cerrar').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevenir el envío del formulario

    try {
        await signOut(auth);
        alert("Cierre de sesión exitoso");
        window.location.href = "/login.html";  // Redirigir al login después de cerrar sesión
    } catch (error) {
        alert('Error al cerrar sesión: ' + error.message);
    }
});