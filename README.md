# Automação de Testes e Qualidade (QA) - Minhas Finanças

Este projeto de automação de teste foi construído com base no conceito de engenharia de software chamado "Pirâmide de Testes".
O foco foi realizar testes simples para testes unitários e de integração, enquanto me aprofundava em testes E2E de qualidade que testavam a maior parte do fluxo do usuário, simulando da melhor forma possível um ambiente real.

---

## Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js LTS](https://nodejs.org/)
- O código-fonte do sistema deve estar em `../ExameDesenvolvedorDeTestes` em relação à raiz deste repositório

---

## Como rodar os testes

### Testes Unitários (C#)

```bash
cd MinhasFinancas.UnitTests
dotnet test
```

### Testes de Integração (C#)

```bash
cd MinhasFinancas.IntegrationTests
dotnet test
```

> Os testes de integração sobem a API em memória automaticamente — não é necessário rodar a aplicação antes.

### Testes E2E (Playwright)

Antes de rodar, suba a aplicação via Docker a partir da raiz do repositório ExameDesenvolvedorDeTestes (o código-fonte do sistema, não este repositório):

```bash
docker compose up
```

Com a aplicação rodando:

```bash
cd MinhasFinancas.E2E
npm install
npx playwright install
npx playwright test
```

> Os testes apontam para `http://localhost:5173` por padrão, conforme configurado no `playwright.config.ts`.

---

## Como estruturei a pirâmide

**Unitários** — testam as regras de negócio direto nas entidades e serviços, sem banco e sem rede.

**Integração** — O objetivo aqui foi validar que as regras de negócio funcionam de ponta a ponta na camada de API, e foi onde os bugs de código foram capturados.

**E2E (Playwright)** — simulam um usuário real navegando pelo sistema no browser. Usei o padrão Page Object Model para separar os localizadores de elementos dos testes em si, o que deixa o código mais legível e fácil de manter. Cobriram os fluxos principais: criação, edição e exclusão de pessoas, criação de categorias e transações, e navegação por paginação.

---

## Bugs encontrados

### Bugs de código

- **Erro 500 em quebra de regra de negócio:** A controller não consegue lidar com o erro de quebra de negócio e por isso retorna erro 500, mas deveria retornar erro 400. Esta falha foi capturada pelos testes de integração.

### Bugs de interface e comportamento

- **Falhas de design:** O gráfico mensal desaparece após receber certa quantia ou tipos de dados, e textos frequentemente vazam dos cards e se sobrepõem.

- **UI/UX:** A interface apresenta inconsistências — um exemplo é o menu superior que não apresenta o atalho de "Pessoas" exibido pelo menu lateral.

- **Infra:** O sistema não consegue lidar com requisições simultâneas do mesmo usuário. Caso o mesmo envie mais de uma transação ao mesmo tempo, o sistema apresenta falhas.

---

## Justificativa das escolhas

Optei por concentrar mais esforço nos testes E2E porque eles cobrem o fluxo completo do usuário e validam a integração entre frontend e backend de forma que os outros níveis não conseguem. O padrão Page Object Model foi escolhido por tornar os testes mais legíveis e fáceis de manter caso a interface mude.
