
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv') {
        setFileName(file.name);
        onFileChange(file);
      } else {
        alert('Por favor, selecione um arquivo .csv');
        setFileName('');
        onFileChange(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Passo 1: Selecione o arquivo CSV
      </label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      <div 
        className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
        onClick={handleButtonClick}
      >
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-400">
                <span className="font-semibold text-indigo-400">Clique para fazer upload</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500">Apenas arquivos .CSV</p>
            {fileName && <p className="text-xs text-green-400 mt-2">{fileName}</p>}
        </div>
      </div>
    </div>
  );
};