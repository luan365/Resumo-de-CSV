import { GoogleGenAI } from "@google/genai";

interface SummaryResult {
    textSummary: string;
    csvSummary: string;
}

// FIX: Refactored function to remove the apiKey parameter. The key is now securely sourced from environment variables.
export const generateColumnSummary = async (
    analysisColumnName: string, 
    groupingColumnName: string | null,
    data: Record<string, any>[]
): Promise<SummaryResult> => {
  // FIX: Per @google/genai guidelines, the API key must be obtained from process.env.API_KEY.
  // The '!' non-null assertion is used based on the guideline to assume the key is always available.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  let prompt: string;

  if (groupingColumnName) {
     const relevantData = data.slice(0, 200).map(row => ({
        [analysisColumnName]: row[analysisColumnName],
        [groupingColumnName]: row[groupingColumnName]
    }));

    prompt = `
Você é um especialista em análise de dados. Sua tarefa é analisar a coluna "${analysisColumnName}", agrupando os resultados pela coluna "${groupingColumnName}". Gere DOIS resultados distintos: um resumo textual bem formatado e um arquivo CSV.

DADOS PARA ANÁLISE (amostra de até 200 linhas):
---
${JSON.stringify(relevantData, null, 2)}
---

TAREFA 1: GERAR RESUMO TEXTUAL
Analise os dados e, para cada grupo encontrado em "${groupingColumnName}", crie um resumo claro e profissional. Se houver muitos grupos, foque nos 3 com maior volume de dados.

REGRAS DE FORMATAÇÃO PARA O RESUMO TEXTUAL:
1. Antes de cada título, adicione uma linha divisória exata: ────────────
2. O título do grupo deve ser em MAIÚSCULAS, precedido por um emoji relevante (ex: 📈).
3. Siga esta estrutura fixa para cada grupo:
   - Pontos Positivos:
     • [liste aqui de 2 a 4 pontos positivos relevantes]
   - Pontos Negativos:
     • [liste aqui de 2 a 4 pontos negativos relevantes]
   - Resumo:
     [um parágrafo conciso com as principais conclusões]
4. Use bom espaçamento, com uma linha em branco entre cada seção (título, divisória, Pontos Positivos, etc.).
5. O estilo do texto deve ser limpo, corporativo e de fácil leitura, sem formatação extra como negrito ou itálico.

EXEMPLO DE SAÍDA PARA MÚLTIPLOS GRUPOS:
────────────
📈 MARKETING

Pontos Positivos:
• Utilização de tecnologias modernas e alinhadas ao mercado.
• Desenvolvimento de projetos inovadores com boa aceitação.
• Equipe criativa e com bom conhecimento técnico.

Pontos Negativos:
• A gestão de projetos poderia ser mais transparente.
• A infraestrutura de TI apresenta limitações para grandes campanhas.
• Falta de comunicação clara sobre as metas de longo prazo.

Resumo:
O setor de Marketing apresenta como pontos fortes tecnologias modernas e projetos inovadores, mas enfrenta desafios com a falta de transparência na gestão e infraestrutura limitada.


────────────
💡 VENDAS

Pontos Positivos:
• Equipe altamente motivada e proativa.
• Ótimo relacionamento interpessoal com os clientes.

Pontos Negativos:
• As metas de vendas são percebidas como pouco realistas.
• Ferramentas de CRM estão desatualizadas.
• Necessidade de maior treinamento em novos produtos.

Resumo:
O time de Vendas é forte e motivado, mas as metas precisam ser reavaliadas e as ferramentas atualizadas para garantir sustentabilidade.

TAREFA 2: GERAR ARQUIVO CSV
Crie uma string CSV com as colunas: "area de atuacao", "nome", "comentario", "elogio".
- area de atuacao: O valor correspondente da coluna "${groupingColumnName}".
- nome: O tema principal identificado no comentário (ex: "Salário", "Cultura", "Comunicação").
- comentario: Um resumo conciso do feedback.
- elogio: Responda com "1" se for um feedback positivo, ou "0" se for negativo.
A primeira linha do CSV deve ser o cabeçalho, e não deve haver formatação extra.

FORMATO DE SAÍDA OBRIGATÓRIO:
A saída deve conter o resumo textual da TAREFA 1 primeiro.
Em uma nova linha, coloque o separador exato: ---CSV_START---
Logo após o separador, insira o conteúdo CSV da TAREFA 2.
    `;
  } else {
    const columnData = data
        .map((row) => row[analysisColumnName])
        .filter((value) => value !== null && value !== undefined && value.toString().trim() !== '');
    
    if (columnData.length === 0) {
        // FIX: Corrected a critical syntax error. The backtick was escaped (\`), breaking the template string and causing numerous downstream parsing errors.
        throw new Error(`A coluna "${analysisColumnName}" está vazia ou não contém dados válidos.`);
    }

    const columnContent = columnData.slice(0, 500).join('\n');

    prompt = `
Você é um especialista em análise de dados. Sua tarefa é analisar o conteúdo da coluna "${analysisColumnName}" e gerar DOIS resultados: um resumo textual bem formatado e um arquivo CSV.

DADOS PARA ANÁLISE (amostra de até 500 linhas da coluna):
---
${columnContent}
---

TAREFA 1: GERAR RESUMO TEXTUAL
Analise o conteúdo fornecido e apresente um resumo claro e objetivo.

REGRAS DE FORMATAÇÃO PARA O RESUMO TEXTUAL:
1. Comece com uma linha divisória exata: ────────────
2. Na linha seguinte, coloque o título exato: 💡 RESUMO GERAL DA ANÁLISE
3. Siga esta estrutura fixa:
   - Pontos Positivos:
     • [liste aqui de 3 a 5 pontos positivos relevantes]
   - Pontos Negativos:
     • [liste aqui de 3 a 5 pontos negativos relevantes]
   - Resumo:
     [um parágrafo conciso com as principais conclusões]
4. Deixe uma linha em branco entre as seções para melhor legibilidade.
5. O estilo do texto deve ser limpo e profissional, sem formatação adicional como negrito ou itálico.

EXEMPLO DE RESULTADO ESPERADO:
────────────
💡 RESUMO GERAL DA ANÁLISE

Pontos Positivos:
• Feedbacks muito positivos sobre o ambiente de trabalho colaborativo.
• Elogios recorrentes à gestão, considerada justa e acessível.
• Boa percepção sobre a colaboração e sinergia entre as equipes.
• Vários comentários mencionam oportunidades de crescimento.

Pontos Negativos:
• Sugestões consistentes de melhoria nos salários e no pacote de benefícios.
• Críticas sobre a falta de comunicação clara em projetos interdepartamentais.
• Alguns comentários apontam para a necessidade de melhores equipamentos.
• Processos internos são vistos como burocráticos por parte da equipe.

Resumo:
A análise geral dos comentários indica uma percepção majoritariamente positiva em relação ao ambiente e gestão, com oportunidades claras de aprimoramento na política de remuneração, na comunicação interna e na modernização de equipamentos e processos.

TAREFA 2: GERAR ARQUIVO CSV
Crie uma string CSV com as colunas: "nome", "area de atuacao", "comentario", "elogio".
- nome: O tema principal identificado no comentário (ex: "Salário", "Cultura", "Comunicação").
- area de atuacao: Preencha com "Geral".
- comentario: Um resumo conciso do feedback.
- elogio: Responda com "1" se for um feedback positivo, ou "0" se for negativo.
A primeira linha do CSV deve ser o cabeçalho, e não deve haver formatação extra.

FORMATO DE SAÍDA OBRIGATÓRIO:
A saída deve conter o resumo textual da TAREFA 1 primeiro.
Em uma nova linha, coloque o separador exato: ---CSV_START---
Logo após o separador, insira o conteúdo CSV da TAREFA 2.
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
    // FIX: Updated error message to be more relevant now that the API key is handled by environment variables.
    throw new Error("Não foi possível gerar o resumo. Verifique a configuração da API e suas permissões de uso.");
  }
};