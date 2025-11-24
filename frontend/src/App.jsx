// src/App.jsx
import React, { useState, useMemo } from 'react';
import { useFinanceData } from './hooks/useFinanceData';
import NavButton from './components/layout/NavButton';
import Dashboard from './components/dashboard/Dashboard';
import AddTransaction from './components/transactions/AddTransaction';
import TransactionList from './components/forms/TransactionList';
import SettingsPage from './components/settings/SettingsPage';
import { LayoutDashboard, Plus, Settings, StatusMessage } from './utils/Icons';

// --- COMPONENTE PRINCIPAL APP ---

const App = () => {
    // Hook personalizado com toda a lógica do Firebase e estado
    const { 
        isLoading, 
        error, 
        transactions, 
        balance, 
        incomeTotal, 
        expenseTotal, 
        addTransaction, 
        deleteTransaction, 
        userId,
        formatCurrency
    } = useFinanceData();

    const [view, setView] = useState('dashboard'); // 'dashboard', 'transactions', 'settings'

    // Determina o conteúdo principal com base na view
    const content = useMemo(() => {
        if (isLoading) {
            return <StatusMessage message="Carregando dados e autenticando..." />;
        }
        if (error) {
            return <StatusMessage message={error} isError={true} />;
        }
        
        // Mapeamento das telas
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                    balance={balance} 
                    incomeTotal={incomeTotal} 
                    expenseTotal={expenseTotal} 
                    userId={userId} 
                    formatCurrency={formatCurrency} 
                    transactions={transactions}
                />;
            case 'transactions':
                return (
                    <div className="space-y-8">
                        {/* AddTransaction incluído aqui para permitir o registro imediato */}
                        <AddTransaction addTransaction={addTransaction} /> 
                        <section className="space-y-6">
                            <h2 className="text-3xl font-extrabold text-gray-900">Histórico de Transações</h2>
                            <TransactionList 
                                transactions={transactions} 
                                formatCurrency={formatCurrency} 
                                deleteTransaction={deleteTransaction} 
                                showDelete={true} 
                            />
                        </section>
                    </div>
                );
            case 'settings':
                return <SettingsPage userId={userId} />;
            default:
                return <Dashboard 
                    balance={balance} 
                    incomeTotal={incomeTotal} 
                    expenseTotal={expenseTotal} 
                    userId={userId} 
                    formatCurrency={formatCurrency} 
                    transactions={transactions}
                />;
        }
    }, [view, isLoading, error, balance, incomeTotal, expenseTotal, userId, formatCurrency, transactions, addTransaction, deleteTransaction]);

    return (
        <div className="min-h-screen bg-gray-50 font-[Inter] antialiased">
            {/* Header / Navegação */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-indigo-600 flex items-center space-x-2">
                        <LayoutDashboard className="w-6 h-6" />
                        <span>Finanças App</span>
                    </h1>
                    
                    <nav className="flex space-x-3">
                        <NavButton 
                            label="Dashboard" 
                            icon={LayoutDashboard} // Usando Lucide
                            active={view === 'dashboard'} 
                            onClick={() => setView('dashboard')} 
                        />
                        <NavButton 
                            label="Transações" 
                            icon={Plus} // Usando Lucide
                            active={view === 'transactions'} 
                            onClick={() => setView('transactions')} 
                        />
                        <NavButton 
                            label="Configurações" 
                            icon={Settings} // Usando Lucide
                            active={view === 'settings'} 
                            onClick={() => setView('settings')} 
                        />
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {content}
            </main>
        </div>
    );
};

export default App;