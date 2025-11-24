import React, { useState } from "react";

export default function EditItemForm({ item, onSave }) {
  const [name, setName] = useState(item?.name || "");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name });
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm text-gray-600">Nome</span>
        <input
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Salvar
      </button>
    </div>
  );
}
