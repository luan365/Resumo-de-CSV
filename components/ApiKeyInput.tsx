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
    <p className="mt-2 text-xs text-gray-400 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>
        O uso da API pode gerar custos. Verifique os{' '}
        <a 
          href="https://ai.google/pricing/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-400 hover:underline"
        >
          preços do Google Gemini
        </a>.
      </span>
    </p>
  </div>
);