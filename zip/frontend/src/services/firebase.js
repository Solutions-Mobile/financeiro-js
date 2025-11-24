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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
export const collectionPath = (collectionName, currentUserId) =>
`/artifacts/${localFirebaseConfig.projectId}/users/${currentUserId}/${collectionName}`;

