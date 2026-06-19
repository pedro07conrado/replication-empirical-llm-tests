# replication-empirical-llm-tests

Infraestrutura experimental em Node.js com TypeScript para uma replicacao parcial do artigo "An Empirical Evaluation of Using Large Language Models for Automated Unit Test Generation".

Nesta primeira etapa, o projeto coleta funcoes publicas exportadas por pacotes npm-alvo e salva os metadados em `results/api-functions.json`. A integracao com LLMs e a geracao real de testes ficam para etapas futuras.

## Escopo atual

- Usa Node.js com TypeScript.
- Define pacotes npm-alvo em `src/config/packages.ts`.
- Importa dinamicamente cada pacote.
- Percorre exports e objetos relacionados para encontrar funcoes publicas.
- Evita loops em objetos visitados usando `WeakSet`.
- Salva, quando possivel:
  - `packageName`
  - `functionPath`
  - `parameterCount`
  - `functionSignature`
  - `functionBody`
- Seleciona uma amostra estratificada por pacote com seed fixa.
- Gera prompts para testes unitarios Mocha usando `assert` nativo do Node.js.
- Estima tokens e custo antes da execucao contra provedores de LLM.
- Executa prompts em um cliente LLM generico, usando mock local por padrao.

## Pacotes-alvo iniciais

- `countries-and-timezones`
- `plural`
- `geo-point`
- `complex.js`
- `quill-delta`

## Estrutura

```text
src/
  api-explorer/
    apiExplorer.ts
  config/
    models.ts
    packages.ts
  experiment/
    collectApiFunctions.ts
    estimateTokens.ts
    generatePrompts.ts
    generateTestsWithLLM.ts
    sampleApiFunctions.ts
  llm/
    clientFactory.ts
    mockLLMClient.ts
    openAIClient.ts
  metrics/
    tokenEstimator.ts
  prompt-generation/
    promptGenerator.ts
  sampling/
    stratifiedSampler.ts
  types.ts
results/
generated-tests/
```

## Instalacao

```bash
npm install
```

## Execucao

```bash
npm run collect:functions
```

O comando cria ou atualiza:

```text
results/api-functions.json
```

Para selecionar a amostra estratificada:

```bash
npm run sample:functions
```

O comando le `results/api-functions.json` e cria ou atualiza:

```text
results/sample-functions.json
results/sample-summary.csv
```

Para gerar prompts a partir da amostra:

```bash
npm run generate:prompts
```

O comando le `results/sample-functions.json` e cria ou atualiza:

```text
results/generated-prompts.json
```

Cada funcao amostrada recebe tres variantes de prompt:

- `signature-only`: usa o caminho da funcao e a assinatura aproximada.
- `signature-and-body`: usa caminho, assinatura e corpo da funcao.
- `full`: usa caminho, assinatura e corpo, com espaco reservado para documentacao e exemplos de uso.

Para estimar tokens e custo dos prompts:

```bash
npm run estimate:tokens
```

O comando le `results/generated-prompts.json` e cria ou atualiza:

```text
results/token-estimates.json
```

## Estimativa de tokens e custo

A contagem atual e uma estimativa pre-execucao. Ela usa a aproximacao inicial de 1 token para cada 4 caracteres do prompt e um limite configurado de tokens maximos de saida por prompt.

Os precos por modelo ficam em `src/config/models.ts`, com:

- `modelName`
- `inputCostPer1MTokens`
- `outputCostPer1MTokens`

O custo estimado usa:

```text
cost = (inputTokens / 1_000_000) * inputCostPer1MTokens + (outputTokens / 1_000_000) * outputCostPer1MTokens
```

Esses valores servem para planejamento antes da chamada ao LLM. Em execucoes reais, os tokens efetivamente consumidos devem ser coletados da resposta da API do provedor e registrados como metrica observada.

## Geracao com LLM

Para executar os prompts contra um cliente LLM:

```bash
npm run generate:tests:llm
```

O comando le `results/generated-prompts.json` e salva:

```text
results/llm-generations.json
```

Por padrao, se `OPENAI_API_KEY` nao estiver configurada, o projeto usa `MockLLMClient`, sem chamada externa e sem custo real. Para usar a OpenAI:

```bash
OPENAI_API_KEY=... LLM_MODEL=gpt-4.1-mini npm run generate:tests:llm
```

O modelo tambem pode ser alterado com `LLM_MODEL`. Quando a API real retorna `usage`, os tokens reais sao usados nos campos `inputTokens`, `outputTokens` e `totalTokens`.

Use filtros para controlar custo:

```bash
npm run generate:tests:llm -- --limit 5
npm run generate:tests:llm -- --package countries-and-timezones
npm run generate:tests:llm -- --variant signature-only
npm run generate:tests:llm -- --limit 5 --package countries-and-timezones --variant signature-only
```

## Estrategia de amostragem

A replicacao usa uma amostra alvo de 157 funcoes, calculada a partir de uma populacao aproximada de 1.600 funcoes, nivel de confianca de 90%, erro amostral de 5% e distribuicao 80/20.

A implementacao atual aplica amostragem estratificada por pacote:

- agrupa as funcoes por `packageName`;
- calcula a cota proporcional de cada pacote em relacao ao total coletado;
- garante pelo menos uma funcao selecionada para pacotes que possuem funcoes, quando o tamanho da amostra permite;
- ajusta arredondamentos pelas maiores fracoes residuais ate atingir o tamanho alvo;
- embaralha as funcoes dentro de cada pacote usando seed fixa `42`, garantindo reprodutibilidade.

Se o total coletado for menor que 157, a ferramenta seleciona no maximo o total disponivel.

## Validacao

```bash
npm run typecheck
```

## Proximas etapas planejadas

- Gerar prompts por funcao.
- Ampliar provedores de LLM.
- Registrar tokens reais, custo real, testes gerados, testes aprovados e cobertura.
