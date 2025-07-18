// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore"; // ADICIONADO

// Configuração da tua app no Firebase (mantém exatamente como está)
const firebaseConfig = {
  apiKey: "AIzaSyAVMqb6MZegRRMcOoI3fOOo77M04W5qI34",
  authDomain: "pulseiras-verao.firebaseapp.com",
  projectId: "pulseiras-verao",
  storageBucket: "pulseiras-verao.firebasestorage.app", // ⬅️ ATENÇÃO: domínio incorreto aqui, deve ser ".appspot.com"
  messagingSenderId: "630685110636",
  appId: "1:630685110636:web:1855a6601bf376d5e3a349",
  measurementId: "G-1N9MPMWF6W"
};

// Inicializa a app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa a Firestore (essencial para o App.js)
export const db = getFirestore(app);


