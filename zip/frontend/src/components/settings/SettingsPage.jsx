// src/components/settings/SettingsPage.jsx
import React from 'react';
import WalletsSettings from "./WalletsSettings";
import GroupsSettings from "./GroupsSettings";
import CategoriesSettings from "./CategoriesSettings";

const SettingsPage = ({ userId }) => (
    <section className="space-y-8">
        
        {/* TÍTULO */}
        <h2 className="text-3xl font-extrabold text-gray-900">Configurações</h2>

        {/* INFORMAÇÕES DA CONTA */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Informações da Conta</h3>
            <p className="text-gray-600">
                Este aplicativo utiliza autenticação anônima ou customizada. 
                Seus dados estão vinculados ao seguinte ID:
            </p>
            <div className="p-3 bg-gray-100 rounded-lg font-mono break-all text-sm text-gray-700">
                {userId || "Aguardando autenticação..."}
            </div>
            <p className="text-sm text-indigo-500">
                Nota: Este ID é a chave para seus dados no Firestore. Mantenha-o seguro.
            </p>
        </div>

        {/* CRUD DE CARTEIRAS */}
        <WalletsSettings userId={userId} />

        {/* CRUD DE GRUPOS */}
        <GroupsSettings userId={userId} />

        {/* CRUD DE CATEGORIAS */}
        <CategoriesSettings userId={userId} />

    </section>
);

export default SettingsPage;
