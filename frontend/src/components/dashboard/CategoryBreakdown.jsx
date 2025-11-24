// src/components/dashboard/CategoryBreakdown.jsx
import React, { useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";

export default function CategoryBreakdown({ transactions = [] }) {
  const byCategory = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const cat = t.category || "Outros";
      const amount = Number(t.amount) || 0;
      if (!map[cat]) map[cat] = 0;
      map[cat] += t.type === "income" ? amount : -amount;
    });
    return Object.entries(map).map(([category, value]) => ({ category, value }));
  }, [transactions]);

  if (!byCategory.length) return <div>Nenhuma categoria.</div>;

  return (
    <div className="space-y-2">
      {byCategory.map((c) => (
        <div key={c.category} className="flex justify-between">
          <div>{c.category}</div>
          <div>{formatCurrency ? formatCurrency(c.value) : c.value}</div>
        </div>
      ))}
    </div>
  );
}
