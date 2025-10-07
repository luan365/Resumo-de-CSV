
import React from 'react';

interface ColumnInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColumnInput: React.FC<ColumnInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="columnName" className="block text-sm font-medium text-gray-300 mb-2">
        2. Nome da Coluna para Análise
      </label>
      <input
        type="text"
        id="columnName"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Descrição do Produto"
        className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  );
};
