// src/components/settings/GroupsSettings.jsx
import React, { useState } from "react";
import useCollection from "../../hooks/useCollections";

export default function GroupsSettings({ userId }) {
  const { items: groups, loading, error, addItem, updateItem, removeItem } = useCollection({
    userId,
    collectionName: "groups",
    orderField: "name"
  });

  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingValues, setEditingValues] = useState({ name: "", description: "" });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nome é obrigatório");
    try {
      await addItem({ name: form.name.trim(), description: form.description.trim() || "" });
      setForm({ name: "", description: "" });
    } catch (err) {
      alert("Erro ao adicionar grupo: " + err.message);
    }
  };

  const startEdit = (g) => {
    setEditingId(g.id);
    setEditingValues({ name: g.name || "", description: g.description || "" });
  };

  const saveEdit = async (id) => {
    try {
      await updateItem(id, { name: editingValues.name.trim(), description: editingValues.description.trim() });
      setEditingId(null);
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Grupos</h3>
        <p className="text-sm text-gray-500">Agrupe tipos de lançamentos</p>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-4 gap-3">
        <input className="col-span-1 p-2 border rounded" placeholder="Nome do grupo" value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="col-span-2 p-2 border rounded" placeholder="Descrição (opcional)" value={form.description}
               onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="col-span-1 bg-indigo-600 text-white rounded px-3 py-2">Adicionar</button>
      </form>

      {loading ? <div>Carregando grupos...</div> : null}
      {error ? <div className="text-red-600">Erro: {String(error)}</div> : null}

      <ul className="space-y-2">
        {groups.map(g => (
          <li key={g.id} className="p-3 bg-gray-50 rounded flex items-center justify-between">
            <div>
              {editingId === g.id ? (
                <>
                  <input className="p-1 border rounded mr-2" value={editingValues.name} onChange={(e) => setEditingValues({ ...editingValues, name: e.target.value })} />
                  <input className="p-1 border rounded w-64" value={editingValues.description} onChange={(e) => setEditingValues({ ...editingValues, description: e.target.value })} />
                </>
              ) : (
                <>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-sm text-gray-600">{g.description}</div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {editingId === g.id ? (
                <>
                  <button onClick={() => saveEdit(g.id)} className="text-green-600">Salvar</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">Cancelar</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(g)} className="text-indigo-600">Editar</button>
                  <button onClick={() => removeItem(g.id)} className="text-red-600">Remover</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
