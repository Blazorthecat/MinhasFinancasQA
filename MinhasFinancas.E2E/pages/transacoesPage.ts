import {Page, Locator, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

export class transacoesPage {
  readonly page: Page;
  readonly titulo: Locator;
  readonly botaoAdicionarTransacao: Locator;
  readonly botaoSalvar: Locator;
  readonly tabelaTransacoes: {
    tabela: Locator;
    colunaData: Locator
    colunaDescricao: Locator;
    colunaValor: Locator;
    colunaTipo: Locator;
    colunaCategoria: Locator;
    colunaPessoa: Locator;
  };
  readonly paginaAnterior: Locator;
  readonly proximaPagina: Locator;

  // Base da API (mesma versão usada pelo frontend). Usada apenas para PREPARAR
  // dados de teste de forma determinística (não substitui a validação via UI).
  private readonly apiBase = 'http://localhost:5000/api/v1.0';

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'Transações' });
    this.botaoAdicionarTransacao = page.getByRole('button', { name: 'Adicionar Transação' });
    this.botaoSalvar = page.getByRole('button', { name: 'Salvar' });
    const tabela = page.getByRole('table');
    this.tabelaTransacoes = {
      tabela: tabela,
      colunaData: tabela.getByRole('columnheader', { name: 'Data' }),
      colunaDescricao: tabela.getByRole('columnheader', { name: 'Descrição' }),
      colunaValor: tabela.getByRole('columnheader', { name: 'Valor' }),
      colunaTipo: tabela.getByRole('columnheader', { name: 'Tipo' }),
      colunaCategoria: tabela.getByRole('columnheader', { name: 'Categoria' }),
      colunaPessoa: tabela.getByRole('columnheader', { name: 'Pessoa' }),
    };
    this.paginaAnterior = page.getByRole('button', { name: 'Anterior' });
    this.proximaPagina = page.getByRole('button', { name: 'Próximo' });
  }

  async pageIsLoadedCorrectly(){
    await expect(this.titulo).toBeVisible();
    await expect(this.botaoAdicionarTransacao).toBeVisible();
    await expect(this.tabelaTransacoes.tabela).toBeVisible();
    await expect(this.tabelaTransacoes.colunaData).toBeVisible();
    await expect(this.tabelaTransacoes.colunaDescricao).toBeVisible();
    await expect(this.tabelaTransacoes.colunaValor).toBeVisible();
    await expect(this.tabelaTransacoes.colunaTipo).toBeVisible();
    await expect(this.tabelaTransacoes.colunaCategoria).toBeVisible();
    await expect(this.tabelaTransacoes.colunaPessoa).toBeVisible();
    await expect(this.paginaAnterior).toBeVisible();
    await expect(this.proximaPagina).toBeVisible();
  }

  // Garante (idempotente, via API) que uma pessoa exista. O prefixo "AAA " faz a
  // pessoa ordenar em primeiro (ORDER BY Nome ASC), caindo sempre na 1ª página do
  // dropdown — independente de quantas pessoas já existam no banco.
  private async garantirPessoa(nome: string, dataNascimento: string){
    const r = await this.page.request.get(`${this.apiBase}/pessoas`, { params: { search: nome, pageSize: 50 } });
    const body = await r.json();
    const items = body.items ?? body.Items ?? [];
    if (!items.some((p: { nome?: string }) => p.nome === nome)) {
      await this.page.request.post(`${this.apiBase}/pessoas`, { data: { nome, dataNascimento } });
    }
  }

  // Garante (idempotente, via API) que uma categoria exista. finalidade: 0=Despesa, 1=Receita.
  private async garantirCategoria(descricao: string, finalidade: number){
    const r = await this.page.request.get(`${this.apiBase}/categorias`, { params: { search: descricao, pageSize: 50 } });
    const body = await r.json();
    const items = body.items ?? body.Items ?? [];
    if (!items.some((c: { descricao?: string }) => c.descricao === descricao)) {
      await this.page.request.post(`${this.apiBase}/categorias`, { data: { descricao, finalidade } });
    }
  }

  // Abre um LazySelect e clica na opção. Como a opção alvo ordena em primeiro,
  // ela já vem na carga inicial (1ª página) — sem digitar/buscar (evita o loop
  // de refetch) e sem "Carregar mais" (que travava).
  private async selecionarNoDropdown(rotuloInput: string, nomeOpcao: string){
    await this.page.getByRole('textbox', { name: rotuloInput }).click();
    await this.page.getByRole('option', { name: nomeOpcao }).first().click();
  }

  async adicionarNovaTransacao(tipo: 'Despesa' | 'Receita'){
    // Arrange — dados determinísticos. Pessoa ADULTA (para Receita não esbarrar na
    // regra de menoridade) e categoria com finalidade compatível com o tipo.
    // Ambas são garantidas via API e ordenam em primeiro (prefixo "AAA ").
    const descricao = faker.lorem.sentence({ min: 2, max: 6 });
    const valor = faker.finance.amount({ min: 10, max: 1000 });
    const data = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
    const pessoa = 'AAA Adulto Fixo QA';
    const categoria = tipo === 'Receita' ? 'AAA Receita QA' : 'AAA Despesa QA';

    await this.garantirPessoa(pessoa, '1990-01-01');
    await this.garantirCategoria(categoria, tipo === 'Receita' ? 1 : 0);

    // Act
    await this.page.goto('/transacoes');
    await this.botaoAdicionarTransacao.click();
    await this.page.getByRole('textbox', { name: 'Descrição' }).fill(descricao);
    await this.page.getByRole('spinbutton', { name: 'Valor' }).fill(valor);
    await this.page.locator('input[type="date"]').fill(data);
    await this.page.locator('select#tipo').selectOption({ label: tipo });
    await this.selecionarNoDropdown('Lista de pessoas', pessoa);
    await this.selecionarNoDropdown('Lista de categorias', categoria);
    await this.botaoSalvar.click();

    // Assert — o formulário fecha ao salvar com sucesso (botão Salvar some).
    await expect(this.botaoSalvar).toBeHidden();
  }

  async proximaPaginaDaTabela(){
    await this.proximaPagina.click();
  }

  async proximaPaginaDesabilitada(){
    await expect(this.proximaPagina).toBeDisabled();
  }

  async paginaAnteriorDaTabela(){
    await this.paginaAnterior.click();
  }

  async paginaAnteriorDesabilitada(){
    await expect(this.paginaAnterior).toBeDisabled();
  }
}
