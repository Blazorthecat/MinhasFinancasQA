import {Page, Locator, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

export class categoriasPage {
  readonly page: Page
  readonly titulo: Locator;
  readonly botaoAdicionarCategoria: Locator;
  readonly tabelaCategorias: {
    tabela: Locator;
    colunaDescricao: Locator;
    colunaFinalidade: Locator;
  }
  readonly paginaAnterior: Locator;
  readonly proximaPagina: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'Categorias' });
    this.botaoAdicionarCategoria = page.getByRole('button', { name: 'Adicionar Categoria' });
    const tabela = page.getByRole('table');
    this.tabelaCategorias = {
      tabela: tabela,
      colunaDescricao: tabela.getByRole('columnheader', { name: 'Descrição' }),
      colunaFinalidade: tabela.getByRole('columnheader', { name: 'Finalidade' }),
    };
    this.paginaAnterior = page.getByRole('button', { name: 'Anterior' });
    this.proximaPagina = page.getByRole('button', { name: 'Próximo' });
  }

  async pageIsLoadedCorrectly(){
    await expect(this.titulo).toBeVisible();
    await expect(this.botaoAdicionarCategoria).toBeVisible();
    await expect(this.tabelaCategorias.tabela).toBeVisible();
    await expect(this.tabelaCategorias.colunaDescricao).toBeVisible();
    await expect(this.tabelaCategorias.colunaFinalidade).toBeVisible();
    await expect(this.paginaAnterior).toBeVisible();
    await expect(this.proximaPagina).toBeVisible();
  }

  async adicionarNovaCategoria(finalidade: 'Despesa' | 'Receita' | 'Ambas'){
    const descricao = faker.lorem.sentence({min: 2, max: 6});

    await this.botaoAdicionarCategoria.click();
    await this.page.getByRole('textbox', { name: 'Descrição' }).fill(descricao);
    await this.page.getByRole('combobox', { name: 'Finalidade' }).selectOption(finalidade);
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