// src/components/dashboard/Dashboard.jsx
import React from "react";
import {useTransactions} from "../../hooks/useTransactions";
import SummaryCard from "./SummaryCard";
import CategoryBreakdown from "./CategoryBreakdown";

export default function Dashboard({ userId }) {
  const { transactions, loading, error, getSummary } = useTransactions(userId);
  const summary = getSummary();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Receitas" value={summary.incomeFormatted} />
        <SummaryCard title="Despesas" value={summary.expenseFormatted} />
        <SummaryCard title="Total" value={summary.totalFormatted} />
      </div>

      <div>
        <h3 className="font-medium mb-2">Por categoria</h3>
        <CategoryBreakdown transactions={transactions} />
      </div>

      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-600">Erro: {error.message || String(error)}</div>}
    </div>
  );
}
