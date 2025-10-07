import { GoogleGenAI } from "@google/genai";

export const generateColumnSummary = async (columnContent: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("A chave da API do Gemini não foi fornecida.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const prompt = `
      Você é um assistente de análise de dados especialista. Analise o seguinte conteúdo de uma coluna de um arquivo CSV e gere um resumo conciso.

      **Sua tarefa é:**
      1.  **Identificar Padrões:** Detecte quaisquer padrões recorrentes, tendências ou anomalias nos dados.
      2.  **Extrair Temas Principais:** Determine os temas ou categorias centrais que emergem do conteúdo.
      3.  **Destacar Informações Relevantes:** Aponte quaisquer pontos de dados, descobertas ou insights particularmente importantes ou surpreendentes.
      4.  **Estruturar o Resumo:** Apresente sua análise em um formato claro e bem estruturado usando markdown, com títulos para cada seção (Padrões, Temas Principais, Informações Relevantes).

      **Conteúdo da Coluna para Análise:**
      ---
      ${columnContent}
      ---

      **Formato de Saída Esperado (Exemplo):**

      ### Resumo da Análise da Coluna

      **Padrões Identificados:**
      - [Padrão 1]
      - [Padrão 2]

      **Temas Principais:**
      - [Tema 1]
      - [Tema 2]

      **Informações Relevantes:**
      - [Insight 1]
      - [Insight 2]
    `;

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