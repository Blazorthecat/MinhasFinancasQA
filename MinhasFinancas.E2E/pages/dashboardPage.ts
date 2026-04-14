import {Page, Locator, expect} from '@playwright/test';

export class dashboardPage {
  readonly page: Page;
  readonly saldoAtual: Locator;
  readonly receitasDoMes: Locator;
  readonly despesasDoMes: Locator;
  readonly ultimasTransacoes: {
    tabela: Locator;
    colunaData: Locator;
    colunaDescricao: Locator;
    colunaCategoria: Locator;
    colunaValor: Locator;
  };
  readonly resumoMensal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saldoAtual = page.getByText('Saldo Atual');
    this.receitasDoMes = page.getByText('Receitas do Mês');
    this.despesasDoMes = page.getByText('Despesas do Mês');
    const tabelaTransacoes = page.locator('.card').filter({ 
      has: page.getByRole('heading', { name: 'Últimas Transações', exact: true }) 
    }).getByRole('table');
    this.ultimasTransacoes = {
      tabela: tabelaTransacoes,
      colunaData: tabelaTransacoes.getByRole('columnheader', { name: 'Data' }),
      colunaDescricao: tabelaTransacoes.getByRole('columnheader', { name: 'Descrição' }),
      colunaCategoria: tabelaTransacoes.getByRole('columnheader', { name: 'Categoria' }),
      colunaValor: tabelaTransacoes.getByRole('columnheader', { name: 'Valor' }),
    };
    this.resumoMensal = page.getByRole('heading', { name: 'Resumo Mensal' });
    }

  async pageIsLoadedCorrectly(){
    await expect(this.saldoAtual).toBeVisible();
    await expect(this.receitasDoMes).toBeVisible();
    await expect(this.despesasDoMes).toBeVisible();
    await expect(this.ultimasTransacoes.tabela).toBeVisible();
    await expect(this.ultimasTransacoes.colunaData).toBeVisible();
    await expect(this.ultimasTransacoes.colunaDescricao).toBeVisible();
    await expect(this.ultimasTransacoes.colunaCategoria).toBeVisible();
    await expect(this.ultimasTransacoes.colunaValor).toBeVisible();
    await expect(this.resumoMensal).toBeVisible();
  }

  async sideMenuLoadedCorrectly(){
    await expect(this.page.getByRole('complementary')).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Dashboard' }).nth(1)).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Transações' }).nth(1)).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Categorias' }).nth(1)).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Pessoas' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Relatórios' }).nth(1)).toBeVisible();
  }
}
