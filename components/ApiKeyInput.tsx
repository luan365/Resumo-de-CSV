import React from 'react';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
      Passo 4: Insira sua Chave de API do Google Gemini
    </label>
    <input
      type="password"
      id="apiKey"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Cole sua chave de API aqui"
      className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);