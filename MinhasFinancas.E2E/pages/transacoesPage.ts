import {Page, Locator, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

export class transacoesPage {
  readonly page: Page;
  readonly titulo: Locator;
  readonly botaoAdicionarTransacao: Locator;
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

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'Transações' });
    this.botaoAdicionarTransacao = page.getByRole('button', { name: 'Adicionar Transação' });
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

  async adicionarNovaTransacao(tipo: 'Despesa' | 'Receita'){
    const descricao = faker.lorem.sentence({min: 2, max: 6});
    const valor = faker.finance.amount({min: 10, max: 1000});
    const data = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
    const tipoDeTransacao = tipo;
    const pessoa = 'Pedro Oliveira';
    const opcaoPessoa = this.page.getByRole('option', { name: pessoa });
    const botaoCarregarMaisPessoas = this.page.getByRole('button', { name: 'Carregar mais' });
    const categoria = 'Alimentação';

    await this.botaoAdicionarTransacao.click();
    await this.page.getByRole('textbox', { name: 'Descrição' }).fill(descricao);
    await this.page.getByRole('spinbutton', { name: 'Valor' }).fill(valor);
    await this.page.locator('input[type="date"]').fill(data);
    await this.page.locator('select#tipo').selectOption({ label: tipoDeTransacao });
    await this.page.getByRole('textbox', { name: 'Lista de pessoas' }).click();
    let pessoaEncontrada = await opcaoPessoa.isVisible();
    while (!pessoaEncontrada) {
      await botaoCarregarMaisPessoas.click();
      pessoaEncontrada = await opcaoPessoa.isVisible();
    }if (pessoaEncontrada) {
      await opcaoPessoa.click();
    }
    await this.page.getByRole('textbox', { name: 'Lista de categorias' }).click();
    await this.page.getByRole('option', { name: categoria }).click();
    await this.page.getByRole('button', { name: 'Salvar' }).click();
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