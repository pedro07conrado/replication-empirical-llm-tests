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
- Executa prompts em um cliente LLM generico, com suporte a Mock, Ollama, Gemini e OpenAI.

## Pacotes-alvo iniciais

- `countries-and-timezones`
- `plural`
- `geo-point`
- `complex.js`
- `quill-delta`
- `simple-statistics`

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
    materializeTests.ts
    runManager.ts
    runCoverage.ts
    runGeneratedTests.ts
    sampleApiFunctions.ts
  coverage/
    coverageRunner.ts
  llm/
    clientFactory.ts
    geminiClient.ts
    mockLLMClient.ts
    ollamaClient.ts
    openAIClient.ts
  metrics/
    tokenEstimator.ts
  prompt-generation/
    promptGenerator.ts
  sampling/
    stratifiedSampler.ts
  test-execution/
    testExecutor.ts
  test-materialization/
    testMaterializer.ts
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

Para executar os prompts contra um cliente LLM, use sempre `--limit` ou `--all`:

```bash
npm run generate:tests:llm -- --limit 5
```

O comando le `results/generated-prompts.json` e salva:

```text
results/llm-generations.json
results/runs/<runId>/llm-generations.json
```

Por padrao, se nenhuma chave estiver configurada, o projeto usa `MockLLMClient`, sem chamada externa e sem custo real.

Para usar Ollama localmente:

1. Instale o Ollama: https://ollama.com
2. Baixe o modelo:

```bash
ollama pull qwen2.5-coder:3b
```

3. Garanta que o Ollama esteja rodando. Abra o aplicativo Ollama ou rode:

```bash
ollama serve
```

4. Configure as variaveis e rode um piloto:

```bash
LLM_PROVIDER=ollama OLLAMA_BASE_URL=http://localhost:11434 LLM_MODEL=qwen2.5-coder:3b LLM_MAX_OUTPUT_TOKENS=2048 npm run generate:tests:llm -- --run-id piloto-ollama-countries-signature-10 --limit 10 --package countries-and-timezones --variant signature-only
```

No PowerShell:

```powershell
$env:LLM_PROVIDER="ollama"
$env:OLLAMA_BASE_URL="http://localhost:11434"
$env:LLM_MODEL="qwen2.5-coder:3b"
$env:LLM_MAX_OUTPUT_TOKENS="2048"
npm run generate:tests:llm -- --run-id piloto-ollama-countries-signature-10 --limit 10 --package countries-and-timezones --variant signature-only
```

Como a execucao e local, `estimatedCost` e `equivalentPaidCost` ficam `0`. Se o Ollama nao estiver rodando, o cliente mostra uma mensagem pedindo para abrir o aplicativo ou executar `ollama serve`. Se o modelo nao existir, a mensagem sugere `ollama pull qwen2.5-coder:3b`.

Para usar Gemini como provedor principal:

```bash
GEMINI_API_KEY=... LLM_PROVIDER=gemini LLM_MODEL=gemini-2.5-flash npm run generate:tests:llm -- --limit 5
```

No PowerShell:

```powershell
$env:GEMINI_API_KEY="..."
$env:LLM_PROVIDER="gemini"
$env:LLM_MODEL="gemini-2.5-flash"
$env:GEMINI_FREE_TIER="true"
npm run generate:tests:llm -- --limit 5
```

`LLM_MAX_OUTPUT_TOKENS` controla o limite de saida por chamada. O Gemini usa `temperature: 0` para reduzir variabilidade. Quando a API retorna `usageMetadata`, o projeto salva `promptTokenCount`, `candidatesTokenCount` e `totalTokenCount` como `inputTokens`, `outputTokens` e `totalTokens`.

Quando `GEMINI_FREE_TIER=true`, `estimatedCost` fica `0`; se existir preco configurado em `src/config/models.ts`, `equivalentPaidCost` registra o custo equivalente pago. `gemini-2.5-flash` e o modelo recomendado para novos testes. `gemini-2.0-flash` continua configuravel via `LLM_MODEL`, mas a documentacao atual de precos da Gemini indica que ele foi desligado em 1 de junho de 2026.

Para usar OpenAI:

```bash
OPENAI_API_KEY=... LLM_PROVIDER=openai LLM_MODEL=gpt-4.1-mini npm run generate:tests:llm -- --limit 5
```

O modelo tambem pode ser alterado com `LLM_MODEL`. Quando a API real retorna `usage` ou `usageMetadata`, os tokens reais sao usados nos campos `inputTokens`, `outputTokens` e `totalTokens`.

Use filtros para controlar custo:

```bash
npm run generate:tests:llm -- --limit 5
npm run generate:tests:llm -- --limit 5 --package countries-and-timezones
npm run generate:tests:llm -- --limit 5 --variant signature-only
npm run generate:tests:llm -- --limit 5 --package countries-and-timezones --variant signature-only
npm run generate:tests:llm -- --all
```

Para materializar os testes gerados como arquivos `.test.js`:

```bash
npm run materialize:tests
```

O comando le `results/llm-generations.json`, salva cada `generatedText` em:

```text
generated-tests/<packageName>/<promptId>.test.js
```

e cria:

```text
results/materialized-tests.json
results/runs/<runId>/materialized-tests.json
```

Para executar os testes materializados com Mocha:

```bash
npm run run:tests
```

O executor roda cada arquivo individualmente, nao para no primeiro erro e salva:

```text
results/test-execution-results.json
results/test-execution-summary.csv
results/runs/<runId>/test-execution-results.json
results/runs/<runId>/test-execution-summary.csv
```

Falhas sao classificadas como `syntax-error`, `import-error`, `type-error`, `assertion-error`, `timeout`, `filesystem-error`, `incomplete-generation` ou `unknown-error`. Geracoes com `finishReason` igual a `MAX_TOKENS` sao marcadas como `incomplete-generation`.

Para medir cobertura com nyc/Istanbul usando somente os testes que passaram:

```bash
npm run run:coverage
```

O comando le `results/test-execution-results.json` e `results/materialized-tests.json`, agrupa os testes por pacote e executa `nyc + mocha` apenas com os testes passados de cada pacote. Como os pacotes sob teste ficam em `node_modules`, a execucao usa `--exclude-node-modules=false` e restringe `--include` ao pacote avaliado.

Relatorios por pacote sao salvos em:

```text
coverage/<packageName>/
```

Os resultados consolidados sao salvos em:

```text
results/coverage-results.json
results/coverage-summary.csv
results/runs/<runId>/coverage-results.json
results/runs/<runId>/coverage-summary.csv
```

## Execucoes com runId

Para preservar rodadas experimentais, os comandos de geracao, materializacao, execucao e cobertura aceitam `--run-id`. Os arquivos em `results/` continuam funcionando como `latest`, e cada rodada tambem e salva em:

```text
results/runs/<runId>/
```

Exemplo de rodada completa:

```bash
npm run generate:tests:llm -- --run-id piloto-countries-signature-10 --limit 10 --package countries-and-timezones --variant signature-only
npm run materialize:tests -- --run-id piloto-countries-signature-10
npm run run:tests -- --run-id piloto-countries-signature-10
npm run run:coverage -- --run-id piloto-countries-signature-10
```

Se `--run-id` nao for informado, o projeto gera um identificador automatico com data/hora e, quando disponivel, provider, modelo, pacote e variante.

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
