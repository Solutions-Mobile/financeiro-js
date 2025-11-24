// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

// =================================================================
// SIMULAÇÃO DE CONFIGURAÇÃO DE AMBIENTE (SUBSTITUIR POR SUAS CREDENCIAIS)
// Use seu próprio ID de aplicação
const localAppId = 'finance-app-v1';

// Use sua configuração real do Firebase
const localFirebaseConfig = {
  // Lembre-se de usar variáveis de ambiente em produção!
  apiKey: "AIzaSyAear6Op5LoF4eWtJKT04Z3laGvxs950x2",
  authDomain: "financeiro-d5fx2.firebaseapp.com",
  databaseURL: "https://financeiro-d5f31-default-rtdb.firebaseio.com",
  projectId: "financeiro-d5f31",
  storageBucket: "financeiro-d5fx2.firebasestorage.app",
  messagingSenderId: "309455649602",
  appId: "1:309455649604:web:4d51dbb81986fa4dd3b5d22"
};

let app;
let auth;
let db;
let isInitialized = false;

// Função para inicializar o Firebase uma única vez
const initFirebase = () => {
  if (isInitialized) return { app, auth, db, appId: localAppId };

  if (localFirebaseConfig.projectId === "YOUR_PROJECT_ID") {
    console.warn("AVISO: Usando configurações de placeholder do Firebase. O Firestore não funcionará sem as credenciais reais.");
    return { app: null, auth: null, db: null, appId: localAppId };
  }

  try {
    app = initializeApp(localFirebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    setLogLevel('debug');
    isInitialized = true;

    console.log("Firebase inicializado com sucesso (usando configurações locais).");

  } catch (error) {
    console.error("Falha ao inicializar o Firebase:", error);
  }

  return { app, auth, db, appId: localAppId };
}

// Inicializa e exporta as instâncias
initFirebase();

export { app, auth, db, localAppId as appId };

// Helper para caminhos
// artifacts/financeiro-d5f31/users/7QW8skPJAJVS6AwOTDnswvd8cfj2
//  export const collectionPath = (collectionName, currentUserId) =>
//  `/artifacts/${localFirebaseConfig.projectId}/users/${currentUserId}/${collectionName}`;

export const collectionPath = (collectionName, userId) =>
  `users/${userId}/${collectionName}`;
