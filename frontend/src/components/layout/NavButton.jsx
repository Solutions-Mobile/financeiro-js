//src/components/layout/NavButton.jsx
import React from 'react';

const NavButton = ({ label, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all text-sm
            ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'}
        `}
    >
        {Icon && <Icon className="w-5 h-5" />}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

export default NavButton;