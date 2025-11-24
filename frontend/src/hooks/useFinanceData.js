// =================================================================
// 1. Arquivo: src/hooks/useFinanceData.js
// =================================================================
import { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, doc, onSnapshot, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Assumimos que 'auth', 'db' e 'appId' estão corretamente configurados e exportados em 'firebase.js'.
import { auth, db, appId, collectionPath } from '../services/firebase';

const FINANCE_COLLECTION = 'transactions';
const USER_ID = '7QW8skPJAJVS6AwOTDnswvd8cfj2';

/**
 * Hook para gerenciar a autenticação e os dados de transações do Firestore.
 * Depende das instâncias 'auth', 'db' e 'appId' exportadas de '../services/firebase'.
 */
export const useFinanceData = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    // Variável para checar se o serviço foi inicializado com sucesso (verifica se as instâncias são válidas)
    const isServiceReady = !!auth && !!db && !!appId;

    // 1. Autenticação e Listener de Estado
    useEffect(() => {
        if (!isServiceReady) {
            // Se as instâncias não vierem do firebase.js (ex: placeholders não substituídos ou falha na inicialização)
            setError("Erro de Configuração: O serviço Firebase não está pronto. Verifique as credenciais em src/services/firebase.js.");
            setIsAuthReady(true);
            setIsLoading(false);
            return;
        }

        const initAuth = async () => {
            // Lógica de autenticação: se o token estiver presente (vindo do ambiente externo ou configurado internamente), usa-o.
            // Caso contrário, usa sign-in anônimo como fallback.
            try {
                // Nota: Como 'firebase.js' não está exposto, esta parte simula o comportamento mais robusto.
                // Você deve garantir que a lógica de autenticação inicial esteja correta no seu firebase.js, 
                // se precisar de um token específico. Aqui, usamos anônimo por simplicidade.
                await signInAnonymously(auth);
                console.log("Autenticação inicial: Assinado anonimamente.");
            } catch (err) {
                console.error("Falha na autenticação inicial:", err);
                setError(`Falha na Autenticação: ${err.message}`);
            }
        };

        initAuth();

        // Listener de estado de autenticação para atualizar userId
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
            setIsAuthReady(true);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [isServiceReady]);

    // 2. Listener de Dados do Firestore
    useEffect(() => {
        // Guarda: Não tenta buscar dados antes que a autenticação esteja pronta E que o serviço esteja pronto
        if (!isAuthReady || !isServiceReady || !userId) return;

        // Caminho de dados privados por usuário: artifacts/{appId}/users/{userId}/{collectionName}
        const path = collectionPath(FINANCE_COLLECTION, USER_ID);
   
        const transactionsRef = collection(db, path);

        const unsubscribe = onSnapshot(transactionsRef, (snapshot) => {
            const fetchedTransactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordena localmente por data de criação (mais recente primeiro)
            fetchedTransactions.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
            setTransactions(fetchedTransactions);
            setError(null);
        }, (err) => {
            console.error("Erro no listener do Firestore:", err);
            setError(`Erro de Dados: ${err.message}`);
        });

        return () => unsubscribe();
    }, [isAuthReady, isServiceReady, userId]);

    // Funções de CRUD
    const addTransaction = useCallback(async (type, description, amount, date) => {
        if (!isAuthReady || !isServiceReady || !userId) return console.error("Banco de dados não pronto para CRUD.");

        const transactionData = {
            type, // 'income' ou 'expense'
            description,
            amount: parseFloat(amount),
            date: date,
            createdAt: serverTimestamp()
        };

        const path = collectionPath(FINANCE_COLLECTION, USER_ID);

        try {
            await addDoc(collection(db, path), transactionData);
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
            setError(`Falha ao adicionar transação: ${e.message}`);
        }
    }, [isAuthReady, isServiceReady, userId]);

    const deleteTransaction = useCallback(async (id) => {
        if (!isAuthReady || !isServiceReady || !userId) return console.error("Banco de dados não pronto para CRUD.");

        const path = collectionPath(FINANCE_COLLECTION, USER_ID);

        try {
            await deleteDoc(doc(db, path, id));
        } catch (e) {
            console.error("Erro ao deletar documento: ", e);
            setError(`Falha ao deletar transação: ${e.message}`);
        }
    }, [isAuthReady, isServiceReady, userId]);

    // Cálculo do Balanço e Totais (Memoizado)
    const { balance, incomeTotal, expenseTotal } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
            balance: income - expense,
            incomeTotal: income,
            expenseTotal: expense
        };
    }, [transactions]);

    // Formatador de Moeda
    const formatCurrency = useCallback((value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }, []);

    return {
        isLoading,
        error,
        transactions,
        balance,
        incomeTotal,
        expenseTotal,
        addTransaction,
        deleteTransaction,
        userId,
        formatCurrency
    };
};