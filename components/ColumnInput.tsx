import React from 'react';

interface ColumnInputProps {
  value: string;
  onChange: (value: string) => void;
  headers: string[];
  disabled: boolean;
}

export const ColumnInput: React.FC<ColumnInputProps> = ({ value, onChange, headers, disabled }) => {
  if (headers.length > 0) {
    return (
      <div>
        <label htmlFor="columnName" className="block text-sm font-medium text-gray-300 mb-2">
          2. Selecione a Coluna para Análise
        </label>
        <div className="relative">
          <select
            id="columnName"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
          >
            {headers.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

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
        placeholder="Faça upload de um arquivo para ver as colunas"
        disabled={disabled}
        className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export const GroupingColumnInput: React.FC<ColumnInputProps> = ({ value, onChange, headers, disabled }) => {
  if (headers.length === 0) {
    return null;
  }
  
  return (
    <div>
      <label htmlFor="groupingColumnName" className="block text-sm font-medium text-gray-300 mb-2">
        3. Selecione a coluna de Área de Atuação (Opcional)
      </label>
      <div className="relative">
        <select
          id="groupingColumnName"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
        >
          <option value="">Nenhum agrupamento</option>
          {headers.map(header => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}