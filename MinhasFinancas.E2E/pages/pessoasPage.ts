import {Page, Locator, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

export class pessoasPage {
  readonly page: Page
  readonly titulo: Locator;
  readonly botaoAdicionarPessoa: Locator;
  readonly tabelaPessoas: {
    tabela: Locator;
    colunaNome: Locator;
    colunaDataNascimento: Locator;
    colunaIdade: Locator;
    colunaAcoes: Locator;
  }
  readonly botaoDeletar: Locator;
  readonly botaoEditar: Locator;
  readonly paginaAnterior: Locator;
  readonly proximaPagina: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'Pessoas' });
    this.botaoAdicionarPessoa = page.getByRole('button', { name: 'Adicionar Pessoa' });
    const tabela = page.getByRole('table');
    this.tabelaPessoas = {
      tabela: tabela,
      colunaNome: tabela.getByRole('columnheader', { name: 'Nome' }),
      colunaDataNascimento: tabela.getByRole('columnheader', { name: 'Data de Nascimento' }),
      colunaIdade: tabela.getByRole('columnheader', { name: 'Idade' }),
      colunaAcoes: tabela.getByRole('columnheader', { name: 'Ações' }),
    };
    this.botaoDeletar = page.getByRole('button', { name: 'Deletar' });
    this.botaoEditar = page.getByRole('button', { name: 'Editar' });
    this.paginaAnterior = page.getByRole('button', { name: 'Anterior' });
    this.proximaPagina = page.getByRole('button', { name: 'Próximo' });
  }

  async pageIsLoadedCorrectly(){
    await expect(this.titulo).toBeVisible();
    await expect(this.botaoAdicionarPessoa).toBeVisible();
    await expect(this.tabelaPessoas.tabela).toBeVisible();
    await expect(this.tabelaPessoas.colunaNome).toBeVisible();
    await expect(this.tabelaPessoas.colunaDataNascimento).toBeVisible();
    await expect(this.tabelaPessoas.colunaIdade).toBeVisible();
    await expect(this.tabelaPessoas.colunaAcoes).toBeVisible();
    await expect(this.paginaAnterior).toBeVisible();
    await expect(this.proximaPagina).toBeVisible();
  }

  async adicionarNovaPessoa(nome: string){
    const dataDeNascimento = faker.date.birthdate({ min: 17, max: 80, mode: 'age' }).toISOString().split('T')[0];

    await this.botaoAdicionarPessoa.click();
    await this.page.getByRole('textbox', { name: 'Nome' }).fill(nome);
    await this.page.locator('input[type="date"]').fill(dataDeNascimento);
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  async deletarPessoa(nome: string){
    let encontrada = false;

    while (!encontrada) {
      const linhaDaPessoa = this.page.getByRole('row', { name: nome }).first();
      if (await linhaDaPessoa.isVisible()) {
        encontrada = true;
        await linhaDaPessoa.getByRole('button', { name: 'Deletar' }).click();
      } else {
          if (await this.proximaPagina.isDisabled()) {
            throw new Error(`Pessoa com nome "${nome}" não encontrada.`);
          }
        await this.proximaPagina.click();
        await this.page.waitForLoadState('networkidle');
      }
      
    }
    const modalConfirmacao = this.page.getByRole('dialog', { name: 'Deletar Pessoa' });
    await expect(modalConfirmacao).toBeVisible();
    await expect(modalConfirmacao.getByText('Tem certeza que deseja')).toBeVisible();
    await modalConfirmacao.getByRole('button', { name: 'Confirmar' }).click();
  }

  async editarPessoa(nome: string, novoNome: string){
    let encontrada = false;
    while (!encontrada) {
      const linhaDaPessoa = this.page.getByRole('row', { name: nome }).first();
      if (await linhaDaPessoa.isVisible()) {
        encontrada = true;
        await linhaDaPessoa.getByRole('button', { name: 'Editar' }).click();
        await this.page.getByRole('textbox', { name: 'Nome' }).fill(novoNome);
        await this.page.getByRole('button', { name: 'Salvar' }).click();
      } else {
        await this.proximaPagina.click();
      }
      if (await this.proximaPagina.isDisabled()) {
        throw new Error(`Pessoa com nome "${nome}" não encontrada.`);
      } 
    }
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