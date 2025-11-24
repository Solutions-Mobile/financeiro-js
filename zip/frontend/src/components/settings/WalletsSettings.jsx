// src/components/settings/WalletsSettings.jsx
import React, { useState } from "react";
import useCollection from "../../hooks/useCollections";

const formatCurrency = (v) => {
  if (v == null || v === "") return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));
};

export default function WalletsSettings({ userId }) {
  const { items: wallets, loading, error, addItem, updateItem, removeItem } = useCollection({
    userId,
    collectionName: "wallets",
    orderField: "createdAt"
  });

  const [form, setForm] = useState({ name: "", balance: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({ name: "", balance: "" });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nome é obrigatório");
    const payload = { name: form.name.trim(), balance: Number(form.balance || 0) };
    try {
      await addItem(payload);
      setForm({ name: "", balance: "" });
    } catch (err) {
      alert("Erro ao adicionar carteira: " + err.message);
    }
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    setEditingValues({ name: w.name || "", balance: w.balance ?? 0 });
  };

  const saveEdit = async (id) => {
    try {
      await updateItem(id, { name: editingValues.name.trim(), balance: Number(editingValues.balance || 0) });
      setEditingId(null);
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Carteiras</h3>
        <p className="text-sm text-gray-500">Gerencie seus saldos e contas</p>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-3 gap-3">
        <input
          className="col-span-1 p-2 border rounded"
          placeholder="Nome da carteira"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="col-span-1 p-2 border rounded"
          placeholder="Saldo inicial (0.00)"
          value={form.balance}
          onChange={(e) => setForm({ ...form, balance: e.target.value })}
        />
        <button type="submit" className="col-span-1 bg-indigo-600 text-white rounded px-3 py-2">Adicionar</button>
      </form>

      {loading ? <div>Carregando carteiras...</div> : null}
      {error ? <div className="text-red-600">Erro: {String(error)}</div> : null}

      <ul className="space-y-2">
        {wallets.map((w) => (
          <li key={w.id} className="p-3 bg-gray-50 rounded flex items-center justify-between">
            <div>
              {editingId === w.id ? (
                <>
                  <input
                    className="p-1 border rounded mr-2"
                    value={editingValues.name}
                    onChange={(e) => setEditingValues({ ...editingValues, name: e.target.value })}
                  />
                  <input
                    className="p-1 border rounded w-32"
                    value={editingValues.balance}
                    onChange={(e) => setEditingValues({ ...editingValues, balance: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(w.balance)}</div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === w.id ? (
                <>
                  <button onClick={() => saveEdit(w.id)} className="text-green-600">Salvar</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(w)} className="text-indigo-600">Editar</button>
                  <button onClick={() => removeItem(w.id)} className="text-red-600">Remover</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
