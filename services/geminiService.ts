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
  
  const ai = new GoogleGenAI({ apiKey: apiKey });

  let prompt: string;

  if (groupingColumnName) {
     const relevantData = data.slice(0, 200).map(row => ({
        [analysisColumnName]: row[analysisColumnName],
        [groupingColumnName]: row[groupingColumnName]
    }));

    prompt = `
      Você é um especialista em análise de dados. Sua tarefa é analisar a coluna "${analysisColumnName}", agrupando os resultados pela coluna "${groupingColumnName}", e gerar uma análise estruturada e curta para cada grupo.

      **Sua tarefa é:**
      1.  **Identificar Grupos:** Encontre todos os valores únicos na coluna de agrupamento ("${groupingColumnName}").
      2.  **Análise por Grupo:** Para cada grupo, analise os dados correspondentes da coluna "${analysisColumnName}".
      3.  **Gerar Análise Estruturada:** Para cada grupo, crie uma análise concisa com as seguintes seções em markdown:
          -   **Pontos Positivos**: Liste os principais elogios ou temas positivos.
          -   **Pontos Negativos**: Liste os principais problemas ou temas negativos.
          -   **Resumo: **: Escreva um parágrafo curto que sintetize a análise do grupo.
      4.  **Estrutura Final:** Apresente o resultado usando markdown, com um título para a análise geral e um subtítulo (nível 3, ####) para cada grupo, seguido pela análise estruturada.
      5.  **Separador:** Adicione uma linha horizontal em markdown ('---') entre a análise de cada grupo para uma clara separação visual.

      **Dados para Análise (amostra de até 200 linhas):**
      ---
      ${JSON.stringify(relevantData, null, 2)}
      ---

      **Formato de Saída Esperado (Exemplo):**

      ### Análise Agrupada por ${groupingColumnName}

      #### [Valor do Grupo 1]
      **Pontos Positivos**
      - Elogios sobre a tecnologia utilizada e salários.
      
      **Pontos Negativos**
      - Críticas sobre a comunicação interna e falta de transparência.


      **Resumo: **
      Neste grupo, a tecnologia é um ponto forte, mas a comunicação precisa de melhorias urgentes para aumentar a satisfação geral.

      ---

      #### [Valor do Grupo 2]
      **Pontos Positivos**
      - Oportunidades de aprendizado são muito valorizadas.

      **Pontos Negativos**
      - Processos lentos e infraestrutura limitada são as principais barreiras.


      **Resumo: **
      - Para este segmento, o desenvolvimento profissional é um atrativo que compensa parcialmente os problemas de infraestrutura e processos.
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
      Você é um especialista em análise de dados. Sua tarefa é analisar o conteúdo da coluna "${analysisColumnName}" de um arquivo CSV e gerar uma análise concisa e estruturada.

      **Regras para a Geração da Análise:**
      1.  **Estrutura de Saída:** O resultado deve ser em markdown, dividido em três seções claras usando texto em negrito como título:
          
      -   **Pontos Positivos**
          
      -   **Pontos Negativos**
          
      -   **Resumo: **

      2.  **Conteúdo:**
          
      -   Em "Pontos Positivos", liste os principais temas e elogios recorrentes de forma curta e direta.
          
      -   Em "Pontos Negativos", liste os principais problemas e críticas recorrentes de forma curta e direta.
          
      -   Em "Resumo: ", escreva um parágrafo curto que sintetize a análise geral.
      3.  **Concisão:** Mantenha a análise direta, objetiva e curta.

      **Conteúdo da Coluna para Análise (amostra de até 500 linhas):**
      ---
      ${columnContent}
      ---

      **Formato de Saída Esperado (apenas para ilustrar o estilo):**
      
      **Pontos Positivos**
      - Uso de tecnologias modernas e salários competitivos.
      - Boas oportunidades de aprendizado.

      **Pontos Negativos**
      - Comunicação interna deficiente e falta de transparência da gestão.
      - Infraestrutura limitada e processos lentos.

      **Resumo: **
      - A análise revela um forte contraste entre a satisfação com a remuneração e tecnologia e a insatisfação com a gestão e processos internos. Melhorar a comunicação e a infraestrutura são pontos-chave para o desenvolvimento.
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