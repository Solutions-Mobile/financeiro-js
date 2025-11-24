// src/hooks/useCollection.js
import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { collectionPath, db } from "../services/firebase";

/*
  OBS: Ajuste PROJECT_ROOT se sua estrutura no Firestore tiver um "artifacts/PROJECTID" no caminho.
  No seu caso você mencionou "/artifacts/financeiro-d5f31/users/{userId}/{collectionName}/".
  Se preferir, substitua a construção abaixo pelo seu helper collectionPath.
*/
const PROJECT_ROOT = "artifacts/financeiro-d5f31";

export default function useCollection({ userId, collectionName, orderField = "createdAt" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);

  const buildRef = useCallback(() => {
    if (!userId) return null;
    // caminho: artifacts/financeiro-d5f31/users/{userId}/{collectionName}
    // const colRef = collection(db, collectionPath(colName, USER_ID));
    //return collection(db, `${PROJECT_ROOT}/users/${userId}/${collectionName}`);
    return collection(db, collectionPath(collectionName, userId));
  }, [userId, collectionName]);

  useEffect(() => {
    const collRef = buildRef();
    if (!collRef) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = orderField ? query(collRef, orderBy(orderField, "asc")) : collRef;
    const unsub = onSnapshot(
      q,
      snap => {
        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setItems(arr);
        setLoading(false);
      },
      err => {
        console.error("useCollection onSnapshot error:", err);
        setError(err);
        setLoading(false);
      }
    );

    unsubRef.current = unsub;
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [buildRef, orderField]);

  const addItem = async (payload) => {
    const collRef = buildRef();
    if (!collRef) throw new Error("Usuário não definido ou coleção inválida.");
    try {
      const docRef = await addDoc(collRef, {
        ...payload,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error("addItem error:", err);
      throw err;
    }
  };

  const updateItem = async (id, patch) => {
    const collRef = buildRef();
    if (!collRef) throw new Error("Usuário não definido ou coleção inválida.");
    try {
        const d = doc(db, collectionPath(collectionName, userId), id);
      await updateDoc(d, { ...patch, updatedAt: serverTimestamp() });
      return true;
    } catch (err) {
      console.error("updateItem error:", err);
      throw err;
    }
  };

  const removeItem = async (id) => {
    try {
        const d = doc(db, collectionPath(collectionName, userId), id);
      await deleteDoc(d);
      return true;
    } catch (err) {
      console.error("removeItem error:", err);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem
  };
}
