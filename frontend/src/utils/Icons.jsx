// =================================================================
// 2. Arquivo: src/utils/Icons.jsx
// =================================================================
import React from 'react';
// IMPORTANTE: Este arquivo usa a sintaxe de importação do lucide-react.
// Você deve instalar a biblioteca no seu projeto: npm install lucide-react

// Ícones Lucide
import { Plus, Trash2, Settings, LayoutDashboard, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export { Plus, Trash2, Settings, LayoutDashboard, DollarSign, TrendingUp, TrendingDown };

// Componente utilitário para mensagens de status (Não é um ícone Lucide, mas é um utilitário de UI)
export const StatusMessage = ({ message, isError = false }) => (
    <div className={`p-4 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} mt-4`}>
        {message}
    </div>
);
