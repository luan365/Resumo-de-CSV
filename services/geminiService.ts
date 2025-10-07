import { GoogleGenAI } from "@google/genai";

export const generateColumnSummary = async (
    apiKey: string,
    analysisColumnName: string, 
    groupingColumnName: string | null,
    data: Record<string, any>[]
): Promise<string> => {
  if (!apiKey) {
    throw new Error("A chave da API do Gemini não foi fornecida.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let prompt: string;

  if (groupingColumnName) {
     const relevantData = data.slice(0, 200).map(row => ({
        [analysisColumnName]: row[analysisColumnName],
        [groupingColumnName]: row[groupingColumnName]
    }));

    prompt = `
      Você é um especialista em análise de dados. Sua tarefa é analisar a coluna "${analysisColumnName}", agrupando os resultados pela coluna "${groupingColumnName}", e gerar um arquivo CSV com a análise.

      **Sua tarefa é:**
      1.  **Identificar Grupos:** Encontre todos os valores únicos na coluna de agrupamento ("${groupingColumnName}").
      2.  **Análise por Grupo:** Para cada grupo, analise os dados correspondentes da coluna "${analysisColumnName}" e identifique pontos positivos, pontos negativos e um resumo.
      3.  **Gerar Saída CSV:** Crie uma string no formato CSV, sem formatação extra. O CSV deve ter as seguintes colunas: "Grupo", "Tipo de Feedback", "Descrição".
          -   A coluna "Grupo" conterá o valor da coluna de agrupamento ("${groupingColumnName}").
          -   A coluna "Tipo de Feedback" conterá um dos seguintes valores: "Ponto Positivo", "Ponto Negativo", ou "Resumo".
          -   A coluna "Descrição" conterá o texto da análise.
      4.  **Estrutura do CSV:** A primeira linha DEVE ser o cabeçalho: "Grupo","Tipo de Feedback","Descrição". Use aspas duplas para todos os campos para garantir a compatibilidade.

      **Dados para Análise (amostra de até 200 linhas):**
      ---
      ${JSON.stringify(relevantData, null, 2)}
      ---

      **Formato de Saída Esperado (APENAS A STRING CSV):**
"Grupo","Tipo de Feedback","Descrição"
"[Valor do Grupo 1]","Ponto Positivo","Elogios sobre a tecnologia utilizada e salários."
"[Valor do Grupo 1]","Ponto Negativo","Críticas sobre a comunicação interna e falta de transparência."
"[Valor do Grupo 1]","Resumo","Neste grupo, a tecnologia é um ponto forte, mas a comunicação precisa de melhorias urgentes para aumentar a satisfação geral."
"[Valor do Grupo 2]","Ponto Positivo","Oportunidades de aprendizado são muito valorizadas."
"[Valor do Grupo 2]","Ponto Negativo","Processos lentos e infraestrutura limitada são as principais barreiras."
"[Valor do Grupo 2]","Resumo","Para este segmento, o desenvolvimento profissional é um atrativo que compensa parcialmente os problemas de infraestrutura e processos."
    `;
  } else {
    const columnData = data
        .map((row) => row[analysisColumnName])
        .filter((value) => value !== null && value !== undefined && value.toString().trim() !== '');
    
    if (columnData.length === 0) {
        throw new Error(`A coluna "${analysisColumnName}" está vazia ou não contém dados válidos.`);
    }

    const columnContent = columnData.slice(0, 500).join('\n'); // Limit data to avoid overly long prompts

    prompt = `
      Você é um especialista em análise de dados. Sua tarefa é analisar o conteúdo da coluna "${analysisColumnName}" de um arquivo CSV e gerar um arquivo CSV com a análise.

      **Regras para a Geração da Análise:**
      1.  **Estrutura de Saída:** O resultado deve ser uma string no formato CSV, sem formatação extra. O CSV deve ter as seguintes colunas: "Tipo de Feedback", "Descrição".
      2.  **Conteúdo:**
          -   Crie linhas onde "Tipo de Feedback" seja "Ponto Positivo" para cada tema positivo identificado.
          -   Crie linhas onde "Tipo de Feedback" seja "Ponto Negativo" para cada tema negativo identificado.
          -   Crie uma linha final onde "Tipo de Feedback" seja "Resumo" com um parágrafo que sintetize a análise geral.
      3.  **Formato CSV:** A primeira linha DEVE ser o cabeçalho: "Tipo de Feedback","Descrição". Use aspas duplas para todos os campos para garantir a compatibilidade.

      **Conteúdo da Coluna para Análise (amostra de até 500 linhas):**
      ---
      ${columnContent}
      ---

      **Formato de Saída Esperado (APENAS A STRING CSV):**
"Tipo de Feedback","Descrição"
"Ponto Positivo","Uso de tecnologias modernas e salários competitivos."
"Ponto Positivo","Boas oportunidades de aprendizado."
"Ponto Negativo","Comunicação interna deficiente e falta de transparência da gestão."
"Ponto Negativo","Infraestrutura limitada e processos lentos."
"Resumo","A análise revela um forte contraste entre a satisfação com a remuneração e tecnologia e a insatisfação com a gestão e processos internos. Melhorar a comunicação e a infraestrutura são pontos-chave para o desenvolvimento."
    `;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Não foi possível gerar o resumo. Verifique se sua chave de API está correta e tem permissões de uso.");
  }
};