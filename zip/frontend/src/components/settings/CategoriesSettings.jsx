// src/components/settings/CategoriesSettings.jsx
import React, { useState } from "react";
import useCollection from "../../hooks/useCollections";

export default function CategoriesSettings({ userId }) {
  const { items: categories, loading, error, addItem, updateItem, removeItem } = useCollection({
    userId,
    collectionName: "categories",
    orderField: "name"
  });

  const [form, setForm] = useState({ name: "", color: "#3b82f6" });
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({ name: "", color: "#3b82f6" });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nome é obrigatório");
    try {
      await addItem({ name: form.name.trim(), color: form.color });
      setForm({ name: "", color: "#3b82f6" });
    } catch (err) {
      alert("Erro ao adicionar categoria: " + err.message);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditingValues({ name: c.name || "", color: c.color || "#3b82f6" });
  };

  const saveEdit = async (id) => {
    try {
      await updateItem(id, { name: editingValues.name.trim(), color: editingValues.color });
      setEditingId(null);
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categorias</h3>
        <p className="text-sm text-gray-500">Classifique suas transações</p>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-4 gap-3">
        <input className="col-span-2 p-2 border rounded" placeholder="Nome da categoria" value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="color" className="col-span-1 w-full h-10" value={form.color}
               onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <button type="submit" className="col-span-1 bg-indigo-600 text-white rounded px-3 py-2">Adicionar</button>
      </form>

      {loading ? <div>Carregando categorias...</div> : null}
      {error ? <div className="text-red-600">Erro: {String(error)}</div> : null}

      <ul className="space-y-2">
        {categories.map(c => (
          <li key={c.id} className="p-3 bg-gray-50 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ background: c.color || "#ddd" }} className="w-6 h-6 rounded" />
              {editingId === c.id ? (
                <>
                  <input value={editingValues.name} onChange={(e) => setEditingValues({ ...editingValues, name: e.target.value })} className="p-1 border rounded" />
                  <input type="color" value={editingValues.color} onChange={(e) => setEditingValues({ ...editingValues, color: e.target.value })} className="w-10 h-8 ml-2" />
                </>
              ) : (
                <div>
                  <div className="font-medium">{c.name}</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === c.id ? (
                <>
                  <button onClick={() => saveEdit(c.id)} className="text-green-600">Salvar</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(c)} className="text-indigo-600">Editar</button>
                  <button onClick={() => removeItem(c.id)} className="text-red-600">Remover</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
