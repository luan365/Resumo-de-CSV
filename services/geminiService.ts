import { GoogleGenAI } from "@google/genai";

interface SummaryResult {
    textSummary: string;
    csvSummary: string;
}

export const generateColumnSummary = async (
    apiKey: string,
    analysisColumnName: string, 
    groupingColumnName: string | null,
    data: Record<string, any>[]
): Promise<SummaryResult> => {
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
Você é um especialista em análise de dados. Analise a coluna "${analysisColumnName}", agrupando os resultados pela coluna "${groupingColumnName}". Gere DOIS resultados: um resumo textual e um CSV.

DADOS PARA ANÁLISE (amostra de até 200 linhas):
---
${JSON.stringify(relevantData, null, 2)}
---

TAREFA 1: GERAR RESUMO TEXTUAL
Analise os dados e, para cada grupo em "${groupingColumnName}", forneça um resumo claro e profissional. Se houver muitos grupos, concentre-se nos 3 com maior volume.

REGRAS DE FORMATAÇÃO PARA O RESUMO:
1. Título do grupo em maiúsculas, precedido por um emoji e envolto por hífens para destaque (exemplo: --- 🟦 MARKETING ---).
2. Estrutura fixa para cada grupo:
   - Pontos Positivos:
     • [lista de aspectos positivos]
   - Pontos Negativos:
     • [lista de aspectos negativos]
   - Resumo:
     [texto resumindo as principais conclusões]
3. Deixe uma linha em branco entre seções para melhor legibilidade.
4. O estilo deve ser limpo, corporativo e fácil de ler, sem negrito, itálico ou outros símbolos de formatação.

Exemplo de saída para múltiplos grupos:
--- 🟦 MARKETING ---
Pontos Positivos:
• Benefícios atrativos e projetos inovadores.

Pontos Negativos:
• Comunicação interna deficiente e pouca clareza nas metas.

Resumo:
O setor de Marketing apresenta bons benefícios e inovação, mas enfrenta falhas na comunicação e nas metas.

--- 🟩 TI ---
Pontos Positivos:
• Ambiente colaborativo e uso de tecnologias modernas.

Pontos Negativos:
• Carga horária elevada e falta de reconhecimento.

Resumo:
A TI é elogiada pelo ambiente e inovação, mas precisa equilibrar carga de trabalho e valorização.

TAREFA 2: GERAR ARQUIVO CSV
Crie uma string CSV simples com as colunas: "area de atuacao", "nome", "comentario", "elogio?".
- area de atuacao: valor de "${groupingColumnName}".
- nome: tema principal identificado (ex: "Salário", "Cultura", "Comunicação").
- comentario: resumo conciso do feedback.
- elogio?: "Sim" se positivo, "Não" se negativo.
A primeira linha deve ser o cabeçalho e o CSV não pode ter formatação extra.

FORMATO DE SAÍDA OBRIGATÓRIO:
Primeiro, o resumo textual da TAREFA 1.
Na linha seguinte, o separador exato: ---CSV_START---
Depois, o conteúdo CSV da TAREFA 2.
    `;
  } else {
    const columnData = data
        .map((row) => row[analysisColumnName])
        .filter((value) => value !== null && value !== undefined && value.toString().trim() !== '');
    
    if (columnData.length === 0) {
        throw new Error(`A coluna "${analysisColumnName}" está vazia ou não contém dados válidos.`);
    }

    const columnContent = columnData.slice(0, 500).join('\n');

    prompt = `
Você é um especialista em análise de dados. Analise o conteúdo da coluna "${analysisColumnName}" e gere DOIS resultados: um resumo textual e um CSV.

DADOS PARA ANÁLISE (amostra de até 500 linhas):
---
${columnContent}
---

TAREFA 1: GERAR RESUMO TEXTUAL
Analise o conteúdo e apresente um resumo claro e objetivo.

REGRAS DE FORMATAÇÃO:
1. Comece com um título destacado: --- 📊 RESUMO GERAL DA ANÁLISE ---
2. Estrutura:
   - Pontos Positivos:
     • [itens positivos]
   - Pontos Negativos:
     • [itens negativos]
   - Resumo:
     [síntese geral]
3. Separe as seções com linhas em branco e sem formatações especiais (negrito, itálico, etc.).
4. Estilo deve ser profissional, direto e bem espaçado.

Exemplo:
--- 📊 RESUMO GERAL DA ANÁLISE ---
Pontos Positivos:
• Feedbacks positivos sobre o ambiente e a gestão.

Pontos Negativos:
• Sugestões de melhoria nos salários e na comunicação.

Resumo:
A percepção geral é positiva, com oportunidades de melhoria em remuneração e comunicação.

TAREFA 2: GERAR ARQUIVO CSV
Crie uma string CSV com as colunas: "nome", "area de atuacao", "comentario", "elogio?".
- nome: tema principal identificado.
- area de atuacao: "Geral".
- comentario: resumo conciso do feedback.
- elogio?: "Sim" se positivo, "Não" se negativo.
A primeira linha deve ser o cabeçalho.

FORMATO DE SAÍDA OBRIGATÓRIO:
Primeiro, o resumo textual da TAREFA 1.
Na linha seguinte, o separador exato: ---CSV_START---
Depois, o conteúdo CSV da TAREFA 2.
    `;
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const rawText = response.text;
    const parts = rawText.split('---CSV_START---');
    
    const textSummary = (parts[0] || '').trim();
    let csvSummary = (parts[1] || '').trim();
    
    const cleanCsvString = (text: string): string => {
      const match = text.match(/```(?:csv\n)?([\s\S]*?)```/);
      return match ? match[1].trim() : text.trim();
    };

    csvSummary = cleanCsvString(csvSummary);
    
    if (!textSummary && !csvSummary) {
        throw new Error("A resposta da IA está vazia ou em um formato inesperado.");
    }

    return { textSummary, csvSummary };

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw new Error("Não foi possível gerar o resumo. Verifique se sua chave de API está correta e tem permissões de uso.");
  }
};