import React, { useState, useCallback, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { generateColumnSummary } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { ColumnInput } from './components/ColumnInput';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [columnName, setColumnName] = useState<string>('Descrição');
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini-api-key') || '');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gemini-api-key', apiKey);
  }, [apiKey]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
    setSummary('');
  };

  const handleGenerateSummary = useCallback(async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo CSV primeiro.');
      return;
    }
    if (!columnName.trim()) {
      setError('Por favor, especifique o nome da coluna para analisar.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Por favor, insira sua chave de API do Gemini.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const fileContent = await file.text();
      
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: ParseResult<Record<string, any>>) => {
          try {
            if (results.errors.length > 0) {
              console.error('Errors parsing CSV:', results.errors);
              const firstError = results.errors[0];
              throw new Error(`O arquivo CSV está mal formatado (linha ${firstError.row}): ${firstError.message}`);
            }
            
            const fields = results.meta.fields;
            if (!fields || !fields.includes(columnName)) {
              throw new Error(`A coluna "${columnName}" não foi encontrada no arquivo CSV. Colunas disponíveis: ${fields?.join(', ') || 'Nenhuma'}`);
            }

            const columnData = results.data
              .map((row) => row[columnName])
              .filter((value) => value !== null && value !== undefined && value.toString().trim() !== '');

            if (columnData.length === 0) {
              throw new Error(`A coluna "${columnName}" está vazia ou não contém dados válidos.`);
            }

            const columnContent = columnData.join('\n');
            const generatedSummary = await generateColumnSummary(columnContent, apiKey);
            setSummary(generatedSummary);
          } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro inesperado durante o processamento do CSV.');
          } finally {
            setIsLoading(false);
          }
        },
        error: (err: Error) => {
          console.error('PapaParse error:', err);
          setError(`Falha ao processar o arquivo CSV: ${err.message}`);
          setIsLoading(false);
        }
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro inesperado ao ler o arquivo.');
      setIsLoading(false);
    }
  }, [file, columnName, apiKey]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Analisador de CSV com IA</h1>
          <p className="text-lg text-gray-400">Faça o upload de um arquivo CSV para obter um resumo inteligente de uma coluna específica.</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="space-y-6">
            <FileUpload onFileChange={handleFileChange} />
            <ColumnInput value={columnName} onChange={setColumnName} />
            <ApiKeyInput value={apiKey} onChange={setApiKey} />
            
            <button
              onClick={handleGenerateSummary}
              disabled={isLoading || !file || !apiKey}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Analisando...</span>
                </>
              ) : (
                'Gerar Resumo'
              )}
            </button>
          </div>

          <div className="mt-8">
            {error && <ErrorMessage message={error} />}
            {summary && !isLoading && <SummaryDisplay summary={summary} />}
          </div>
        </main>
      </div>
       <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
        </footer>
    </div>
  );
};

export default App;