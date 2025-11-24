// src/components/transactions/GenericManager.jsx
import React, { useState } from "react";
import useTransactions from "../../hooks/useTransactions";
import TransactionForm from "../forms/TransactionForm";
import TransactionList from "../forms/TransactionList";

export default function GenericManager({ userId }) {
  const {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    removeTransaction,
    getSummary,
  } = useTransactions(userId);

  const [editing, setEditing] = useState(null);

  const handleAdd = async (payload) => {
    await addTransaction(payload);
  };

  const handleEdit = (tx) => {
    setEditing(tx);
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    await updateTransaction(editing.id, payload);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirma exclusão?")) return;
    await removeTransaction(id);
  };

  const summary = getSummary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Transações</h2>
        <div>
          <div>Receitas: {summary.incomeFormatted}</div>
          <div>Despesas: {summary.expenseFormatted}</div>
          <div>Total: {summary.totalFormatted}</div>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Adicionar</h3>
        <TransactionForm onSubmit={handleAdd} submitting={loading} />
      </div>

      <div>
        <h3 className="font-medium">Editar</h3>
        {editing ? (
          <TransactionForm initial={editing} onSubmit={handleUpdate} submitting={loading} />
        ) : (
          <div>Selecione uma transação para editar</div>
        )}
      </div>

      <div>
        <h3 className="font-medium">Lista</h3>
        <TransactionList transactions={transactions} onDelete={handleDelete} onEdit={handleEdit} />
      </div>

      {error && <div className="text-red-600">Erro: {error.message || String(error)}</div>}
    </div>
  );
}
