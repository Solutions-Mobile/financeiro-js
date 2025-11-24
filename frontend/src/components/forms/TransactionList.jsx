// src/components/forms/TransactionList.jsx
import React from "react";
import { formatDate, formatCurrency } from "../../utils/formatters";

export default function TransactionList({ transactions = [], onDelete, onEdit }) {
  if (!transactions.length) return <div>Nenhuma transação.</div>;

  return (
    <div className="space-y-2">
      {transactions.map((t) => (
        <div key={t.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <div className="font-medium">{t.description}</div>
            <div className="text-sm text-gray-500">
              {t.category} • {formatDate ? formatDate(t.date) : t.date}
            </div>
          </div>

          <div className="text-right">
            <div className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency ? formatCurrency(t.amount) : t.amount}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onEdit && onEdit(t)} className="px-2 py-1 border rounded">Editar</button>
              <button onClick={() => onDelete && onDelete(t.id)} className="px-2 py-1 border rounded">Excluir</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
