
import React from 'react';

interface SummaryDisplayProps {
  textSummary: string;
  csvSummary: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ textSummary, csvSummary }) => {
  const downloadSummary = () => {
    if (!csvSummary) return;
    const blob = new Blob([csvSummary], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resumo_analise.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">Resumo da Análise</h2>
      
      <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
        {textSummary}
      </div>

      <button
        onClick={downloadSummary}
        disabled={!csvSummary}
        className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Salvar Análise Detalhada em CSV
      </button>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
