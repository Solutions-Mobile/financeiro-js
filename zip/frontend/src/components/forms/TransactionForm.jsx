// src/components/forms/TransactionForm.jsx
import React, { useState } from "react";

export default function TransactionForm({ onSubmit, initial = {}, submitting = false }) {
  const [form, setForm] = useState({
    description: initial.description || "",
    amount: initial.amount || "",
    date: initial.date || "",
    category: initial.category || "",
    type: initial.type || "expense",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || form.amount === "") {
      alert("Preencha descrição e valor.");
      return;
    }
    const payload = { ...form, amount: Number(form.amount) };
    try {
      if (onSubmit) await onSubmit(payload);
      if (!initial.id) {
        setForm({ description: "", amount: "", date: "", category: "", type: "expense" });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gravar transação.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm">Descrição</label>
        <input name="description" value={form.description} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-sm">Valor</label>
        <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-sm">Data</label>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-sm">Categoria</label>
        <input name="category" value={form.category} onChange={handleChange} className="w-full" />
      </div>

      <div>
        <label className="block text-sm">Tipo</label>
        <select name="type" value={form.type} onChange={handleChange} className="w-full">
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>

      <div>
        <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-blue-600 text-white">
          {submitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
