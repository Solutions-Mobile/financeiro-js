// src/utils/dbActions.js
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, collectionPath } from '../services/firebase';
import { USER_ID } from '../config/user';


// Gera um novo ID
const generateId = () => doc(collection(db, 'dummy')).id;


// Carrega todos os itens de uma coleção
export const getItems = async (colName) => {
if (!USER_ID) return [];


try {
const colRef = collection(db, collectionPath(colName, USER_ID));
const snap = await getDocs(colRef);
return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
console.error(`Erro ao carregar ${colName}:`, error);
return [];
}
};


// Salva um item
export const saveItem = async (colName, item) => {
if (!USER_ID) return;


const id = item.id || generateId();


try {
const docRef = doc(db, collectionPath(colName, USER_ID), id);
await setDoc(docRef, { ...item, id }, { merge: true });
console.log(`Salvo com sucesso em ${colName}`);
} catch (error) {
console.error(`Erro ao salvar em ${colName}:`, error);
throw error;
}
};


// Deleta item por ID
export const deleteItem = async (colName, id) => {
if (!USER_ID) return;


try {
const docRef = doc(db, collectionPath(colName, USER_ID), id);
await deleteDoc(docRef);
console.log(`Item ${id} removido de ${colName}`);
} catch (error) {
console.error(`Erro ao deletar em ${colName}:`, error);
throw error;
}
};