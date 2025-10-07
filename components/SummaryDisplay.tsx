import React from 'react';
import Papa from 'papaparse';

interface SummaryDisplayProps {
  summary: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resumo.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parsedData = Papa.parse(summary.trim(), { header: true, skipEmptyLines: true });
  const headers = parsedData.meta.fields || [];
  const rows: Record<string, string>[] = parsedData.data as Record<string, string>[];
  
  const hasContent = headers.length > 0 && rows.length > 0 && Object.values(rows[0]).some(val => val);

  if (parsedData.errors.length > 0 || !hasContent) {
      console.error("CSV Parsing errors:", parsedData.errors);
      return (
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4">Resumo da Análise</h2>
              <p className="text-gray-400">Não foi possível exibir a prévia da análise. O conteúdo pode ser baixado.</p>
               <button
                    onClick={downloadSummary}
                    className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 ease-in-out"
                >
                    Salvar Resumo em resumo.csv
                </button>
          </div>
      );
  }

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">Resumo da Análise</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900/50 divide-y divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-800/60 transition-colors">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-300 align-top">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={downloadSummary}
        className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 ease-in-out"
      >
        Salvar Resumo em resumo.csv
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
