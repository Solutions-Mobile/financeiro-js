import React, { useState } from "react";
import useCollections from "../../hooks/useCollections";
import Modal from "../common/Modal";
import EditItemForm from "./EditItemForm";

export default function GroupsSettings({ userId }) {
  const { items, addItem, updateItem, removeItem, loading } = useCollections({
    userId,
    collectionName: "groups",
    orderField: "name",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    if (editing) {
      await updateItem(editing.id, data);
    } else {
      await addItem(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Grupos</h3>
        <button
          onClick={openNew}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          + Novo
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <span>{item.name}</span>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(item)}
                className="text-blue-600 font-bold"
              >
                ✏️
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 font-bold"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-500">Carregando...</p>}

      <Modal
        open={modalOpen}
        title={editing ? "Editar Grupo" : "Novo Grupo"}
        onClose={() => setModalOpen(false)}
      >
        <EditItemForm item={editing} onSave={handleSave} />
      </Modal>
    </div>
  );
}
