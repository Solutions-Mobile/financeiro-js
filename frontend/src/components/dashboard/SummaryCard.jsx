//src/components/dashboard/SummaryCard.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const SummaryCard = ({ title, value, color, icon: Icon }) => {
    let bgColor = '';
    let textColor = '';
    
    // Definição de cores baseada na prop 'color'
    if (color === 'green') { bgColor = 'bg-green-500'; textColor = 'text-green-500'; }
    else if (color === 'red') { bgColor = 'bg-red-500'; textColor = 'text-red-500'; }
    else if (color === 'indigo') { bgColor = 'bg-indigo-500'; textColor = 'text-indigo-500'; }

    const borderColor = color === 'indigo' ? 'border-indigo-500' : (color === 'green' ? 'border-green-500' : 'border-red-500');
    const valueColor = color === 'indigo' ? 'text-indigo-900' : (color === 'green' ? 'text-green-700' : 'text-red-700');

    return (
        <div className={`relative p-5 bg-white rounded-xl shadow-lg border-t-4 ${borderColor}`}>
            <div className={`absolute top-0 right-0 p-2 opacity-10 rounded-bl-xl ${bgColor}`}>
                {Icon && <Icon className={`w-10 h-10 ${textColor}`} />}
            </div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <div className="mt-1 flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${valueColor}`}>
                    {formatCurrency(value)}
                </span>
                {Icon && <Icon className={`w-6 h-6 ${textColor}`} />}
            </div>
        </div>
    );
};

export default SummaryCard;