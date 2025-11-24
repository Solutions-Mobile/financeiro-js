// =================================================================
// 5. Arquivo: src/components/AddTransaction.jsx
// =================================================================
import React, { useState } from 'react';
import { Plus, StatusMessage } from '../../utils/Icons';

// Componente para Adicionar Transação
const AddTransaction = ({ addTransaction }) => {
    const today = new Date().toISOString().split('T')[0];
    const [type, setType] = useState('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(today);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!description || !amount || !date) {
            setMessage("Por favor, preencha todos os campos.");
            setIsError(true);
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setMessage("O valor deve ser um número positivo.");
            setIsError(true);
            return;
        }

        try {
            await addTransaction(type, description, amount, date);
            
            // Limpar formulário
            setDescription('');
            setAmount('');
            setDate(today);
            setMessage("Transação adicionada com sucesso!");
        } catch (e) {
            setMessage(`Erro ao adicionar: ${e.message}`);
            setIsError(true);
        }
    };

    const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <section className="max-w-xl mx-auto space-y-6 bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Registrar Nova Transação</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Tipo */}
                <div>
                    <span className={labelClass}>Tipo</span>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-md
                                ${type === 'income' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                        >
                            Receita
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all shadow-md
                                ${type === 'expense' ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                        >
                            Despesa
                        </button>
                    </div>
                </div>

                {/* Descrição */}
                <div>
                    <label htmlFor="description" className={labelClass}>Descrição</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={inputClass}
                        placeholder="Ex: Aluguel, Salário, Supermercado"
                        required
                    />
                </div>

                {/* Valor e Data */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className={labelClass}>Valor (R$)</label>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={inputClass}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className={labelClass}>Data</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={inputClass}
                            max={today}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5 inline-block mr-2" />
                    Registrar {type === 'income' ? 'Receita' : 'Despesa'}
                </button>
            </form>
            
            {message && <StatusMessage message={message} isError={isError} />}
        </section>
    );
};

export default AddTransaction;
