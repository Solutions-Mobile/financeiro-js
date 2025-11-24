// src/hooks/useTransactions.js
import { useEffect, useState, useCallback } from 'react';
import { getItems, saveItem, deleteItem } from '../utils/dbActions';
import { formatCurrency } from "../utils/formatters";

const COLLECTION = "transactions";

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getItems(COLLECTION);
            setTransactions(data);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    const add = async (item) => {
        try {
            await saveItem(COLLECTION, item);
            await load();
        } catch (err) {
            setError(err);
        }
    };

    const remove = async (id) => {
        try {
            await deleteItem(COLLECTION, id);
            await load();
        } catch (err) {
            setError(err);
        }
    };

    // === Função que o Dashboard precisa ===
    const getSummary = useCallback(() => {
        const summary = {
            income: 0,
            expense: 0,
            total: 0
        };

        transactions.forEach(t => {
            const amount = Number(t.amount) || 0;

            if (t.type === "income") {
                summary.income += amount;
            } else {
                summary.expense += amount;
            }

            summary.total = summary.income - summary.expense;
        });

        return {
            ...summary,
            incomeFormatted: formatCurrency(summary.income),
            expenseFormatted: formatCurrency(summary.expense),
            totalFormatted: formatCurrency(summary.total)
        };
    }, [transactions]);

    useEffect(() => {
        load();
    }, []);

    return { 
        transactions, 
        loading, 
        error,
        add, 
        remove, 
        reload: load,
        getSummary
    };
};
