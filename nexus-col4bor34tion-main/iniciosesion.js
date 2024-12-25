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
    // Estilo dinámico para el loader
    const style = document.createElement("style");
    style.innerHTML = `
.pyramid-loader {
  position: relative;
  width: 300px;
  height: 300px;
  display: block;
  transform-style: preserve-3d;
  transform: rotateX(-20deg);
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotateY(360deg);
  }
}

.pyramid-loader .wrapper .side {
  width: 70px;
  height: 70px;
/* you can choose any gradient or color you want */
  /* background: radial-gradient( #2F2585 10%, #F028FD 70%, #2BDEAC 120%); */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform-origin: center top;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.pyramid-loader .wrapper .side1 {
  transform: rotateZ(-30deg) rotateY(90deg);
  background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
}

.pyramid-loader .wrapper .side2 {
  transform: rotateZ(30deg) rotateY(90deg);
  background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
}

.pyramid-loader .wrapper .side3 {
  transform: rotateX(30deg);
  background: conic-gradient( #2F2585, #D8CCE6, #F028FD, #2BDEAC);
}

.pyramid-loader .wrapper .side4 {
  transform: rotateX(-30deg);
  background: conic-gradient( #2BDEAC, #F028FD, #D8CCE6, #2F2585);
}

.pyramid-loader .wrapper .shadow {
  width: 60px;
  height: 60px;
  background: #8B5AD5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: rotateX(90deg) translateZ(-40px);
  filter: blur(12px);
}
    `;
  
    // Agregar estilos al documento
    document.head.appendChild(style); 
}
// Manejo del inicio de sesión
document.getElementById('login').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevenir el envío del formulario de manera normal

    //Creativo el pana y Tio Pt
    const handleLoadingPage = 0;
    //Fin creatividad
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

    const email = document.getElementById('emaillog').value;
    const password = document.getElementById('passwordlog').value;
    //Swal de carga
      Swal.fire({
        title: 'Iniciando sesión...',
        html: `
        <div class="pyramid-loader">
          <div class="wrapper">
            <span class="side side1"></span>
            <span class="side side2"></span>
            <span class="side side3"></span>
            <span class="side side4"></span>
            <span class="shadow"></span>
          </div>  
        </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
                        try {
                        const userCredential = await signInWithEmailAndPassword(auth, email, password);
                        alert("Inicio de sesión exitoso");

                        // Verificar si ya tiene un rol asignado
                        const user = userCredential.user;
                        const userRef = doc(db, "users", user.uid);  // Referencia al documento del usuario
                        const userDoc = await getDoc(userRef);  // Obtener el documento

                        if (userDoc.exists() && userDoc.data().role) {
                            var role = userDoc.data().role;
                            // Redirigir según el rol
                            if (role === "profesor") {
                                window.location.href = "prfesor.html";
                            } else if (role === "student") {
                                window.location.href = "/pagina_estudiante.html";
                            }
                        //es exitoso
                        Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Inicio de sesión exitoso.',
                        showConfirmButton: false,
                        timer: 2000 // Modal se cierra automáticamente después de 2 segundos
                        });

                        } else {
                            // Si no tiene rol, redirigir a la página de selección de roles
                            window.location.href = 'roles.html';
                        }
                    } catch (error) {
                        const errorCode = error.code;
                        if (errorCode === 'auth/wrong-password') {
                            alert('Contraseña incorrecta');
                        } else if (errorCode === 'auth/user-not-found') {
                            alert('Usuario no encontrado');
                        } else if (errorCode === 'auth/invalid-email') {
                            alert('Correo no es válido');
                        } else {
                            alert('Error: ' + error.message);
                        }
                    }   
                        }   
        });
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