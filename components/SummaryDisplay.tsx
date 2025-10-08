
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

  const sections = textSummary.split('────────────').filter(section => section.trim() !== '');

  const renderContentWithSubheadings = (content: string) => {
    // Divide o conteúdo pelos cabeçalhos conhecidos, mantendo-os como delimitadores.
    const parts = content.split(/(Pontos Positivos:|Pontos Negativos:|Resumo:)/);

    // A primeira parte é o que vem antes de "Pontos Positivos:", geralmente espaços em branco.
    // Iteramos a partir do primeiro delimitador capturado.
    const elements = [];
    for (let i = 1; i < parts.length; i += 2) {
      const header = parts[i];
      const text = parts[i + 1];
      elements.push(
        <React.Fragment key={header}>
          <h4 className="text-lg font-semibold text-white mt-6 mb-2">{header}</h4>
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {text ? text.trim() : ''}
          </div>
        </React.Fragment>
      );
    }
    
    // Se nenhum cabeçalho for encontrado, retorna o conteúdo original para evitar uma saída em branco.
    if (elements.length === 0 && content) {
      return (
        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {content.trim()}
        </div>
      );
    }

    return elements;
  };


  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
      {sections.length > 0 ? (
        sections.map((section, index) => {
          const lines = section.trim().split('\n');
          const title = lines.shift() || ''; // Extrai o título da seção
          const content = lines.join('\n'); // O resto é o conteúdo

          return (
            <React.Fragment key={index}>
              {/* Adiciona a linha divisória apenas ENTRE as seções */}
              {index > 0 && <hr className="my-8 border-gray-700" />}
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {renderContentWithSubheadings(content)}
              </div>
            </React.Fragment>
          );
        })
      ) : (
        // Fallback se nenhum delimitador for encontrado, para não quebrar a exibição.
        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {textSummary}
        </div>
      )}

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