import React from 'react';

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
        4. Sua Chave de API do Gemini
      </label>
      <input
        type="password"
        id="apiKey"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole sua chave de API aqui"
        className="w-full bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
      <p className="text-xs text-gray-500 mt-2">
        Você pode obter sua chave no{' '}
        <a 
          href="https://aistudio.google.com/app/apikey" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-400 hover:underline"
        >
          Google AI Studio
        </a>.
      </p>
    </div>
  );
};