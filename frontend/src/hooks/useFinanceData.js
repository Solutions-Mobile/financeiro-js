// =================================================================
// 1. Arquivo: src/hooks/useFinanceData.js
// =================================================================
import { useState, useEffect, useMemo, useCallback } from "react";
import { collection, doc, onSnapshot, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { db, collectionPath } from "../services/firebase";
import { userId as FIXED_USER_ID } from "../config/user";  // <<< IMPORTANTE

const FINANCE_COLLECTION = "transactions";

/**
 * Hook simplificado para gerenciar transações SEM autenticação.
 * O userId vem exclusivamente de src/config/user.js.
 */
export const useFinanceData = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ==============================================================
    // 1. Listener Firestore
    // ==============================================================
    useEffect(() => {
        if (!db || !FIXED_USER_ID) {
            setError("Configuração inválida: Firestore não inicializado ou userId ausente.");
            setIsLoading(false);
            return;
        }

        const path = collectionPath(FINANCE_COLLECTION, FIXED_USER_ID);

        const colRef = collection(db, path.replace(/^\/+/, "")); // remove barra inicial

        const unsubscribe = onSnapshot(
            colRef,
            (snapshot) => {
                const data = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));

                data.sort(
                    (a, b) =>
                        (b.createdAt?.toDate() || 0) -
                        (a.createdAt?.toDate() || 0)
                );

                setTransactions(data);
                setIsLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Erro no listener do Firestore:", err);
                setError(err.message);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // ==============================================================
    // 2. CRUD - Add
    // ==============================================================
    const addTransaction = useCallback(async (type, description, amount, date) => {
        const path = collectionPath(FINANCE_COLLECTION, FIXED_USER_ID);

        try {
            await addDoc(collection(db, path.replace(/^\/+/, "")), {
                type,
                description,
                amount: parseFloat(amount),
                date,
                createdAt: serverTimestamp(),
            });
        } catch (e) {
            console.error("Erro ao adicionar:", e);
            setError(e.message);
        }
    }, []);

    // ==============================================================
    // 3. CRUD - Delete
    // ==============================================================
    const deleteTransaction = useCallback(async (id) => {
        const path = collectionPath(FINANCE_COLLECTION, FIXED_USER_ID);

        try {
            await deleteDoc(doc(db, path.replace(/^\/+/, ""), id));
        } catch (e) {
            console.error("Erro ao deletar:", e);
            setError(e.message);
        }
    }, []);

    // ==============================================================
    // 4. Totais e balanço
    // ==============================================================
    const { balance, incomeTotal, expenseTotal } = useMemo(() => {
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const expense = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
            balance: income - expense,
            incomeTotal: income,
            expenseTotal: expense,
        };
    }, [transactions]);

    // ==============================================================
    // 5. Formatador
    // ==============================================================
    const formatCurrency = (value) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);

    return {
        isLoading,
        error,
        transactions,
        balance,
        incomeTotal,
        expenseTotal,
        addTransaction,
        deleteTransaction,
        userId: FIXED_USER_ID,
        formatCurrency,
    };
};
