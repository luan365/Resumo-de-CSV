import React from 'react';

interface SummaryDisplayProps {
  summary: string;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resumo.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Basic markdown to HTML conversion for display
  const formattedSummary = summary
    .replace(/^---$/gm, '<hr class="my-6 border-gray-700" />')
    .replace(/#### (.*)/g, '<h4 class="text-xl font-bold text-gray-200 mb-2">$1</h4>')
    .replace(/### (.*)/g, '<h3 class="text-2xl font-bold text-indigo-400 mb-3">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-200">$1</strong>')
    .replace(/^- (.*)/gm, '<li class="ml-5 list-disc">$1</li>')
    .replace(/(\<li.*\<\/li\>)/g, '<ul class="space-y-2">$1</ul>')
    .replace(/\n/g, '<br />');


  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-4">Resumo da Análise</h2>
      <div 
        className="prose prose-invert max-w-none text-gray-300 space-y-4"
        dangerouslySetInnerHTML={{ __html: formattedSummary.replace(/<br \/>/g, '') }} 
      />
      <button
        onClick={downloadSummary}
        className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 ease-in-out"
      >
        Salvar Resumo em resumo.txt
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