//src/components/layout/DateSelector.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthNames } from '../../utils/formatters';

const DateSelector = ({ currentMonth, setMonth, currentYear, setYear }) => {
    const handleMonthChange = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }

        setMonth(newMonth);
        setYear(newYear);
    };

    return (
        <div className="flex items-center justify-center p-3 bg-white rounded-xl shadow-lg mb-6">
            <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
                <ChevronLeft />
            </button>
            <div className="mx-4 text-center">
                <span className="text-xl font-bold text-gray-800">{monthNames[currentMonth - 1]}</span>
                <span className="text-xl font-light text-gray-500 ml-2">{currentYear}</span>
            </div>
            <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition">
                <ChevronRight />
            </button>
        </div>
    );
};

export default DateSelector;