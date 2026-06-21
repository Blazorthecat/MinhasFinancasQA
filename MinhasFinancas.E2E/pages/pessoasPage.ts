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
  readonly botaoSalvar: Locator;

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
    this.botaoSalvar = page.getByRole('button', { name: 'Salvar' });
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

  /**
   * Localiza a linha de uma pessoa pelo nome, percorrendo as páginas a partir da
   * primeira. Termina com erro claro quando chega à última página sem encontrar
   * (em vez de travar ou lançar mesmo após encontrar, como na versão anterior).
   */
  private async localizarLinhaDaPessoa(nome: string): Promise<Locator> {
    // Arrange — sempre começa da primeira página para um resultado determinístico.
    await this.page.goto('/pessoas');
    await expect(this.tabelaPessoas.tabela).toBeVisible();

    while (true) {
      const linha = this.page.getByRole('row', { name: nome }).first();
      if (await linha.isVisible()) {
        return linha;
      }
      if (await this.proximaPagina.isDisabled()) {
        throw new Error(`Pessoa com nome "${nome}" não encontrada.`);
      }
      await this.proximaPagina.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async adicionarNovaPessoa(nome: string){
    // Arrange — data de nascimento válida (adulto, nunca no futuro).
    const dataDeNascimento = faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0];

    // Act
    await this.botaoAdicionarPessoa.click();
    await this.page.getByRole('textbox', { name: 'Nome' }).fill(nome);
    await this.page.locator('input[type="date"]').fill(dataDeNascimento);
    await this.botaoSalvar.click();

    // Assert — o formulário fecha ao salvar com sucesso (botão Salvar some).
    await expect(this.botaoSalvar).toBeHidden();
  }

  async editarPessoa(nome: string, novoNome: string){
    // Arrange — encontra a linha da pessoa a editar.
    const linha = await this.localizarLinhaDaPessoa(nome);

    // Act — abre o formulário de edição e troca o nome.
    await linha.getByRole('button', { name: 'Editar' }).click();
    await this.page.getByRole('textbox', { name: 'Nome' }).fill(novoNome);
    await this.botaoSalvar.click();

    // Assert — o formulário fecha e o novo nome passa a existir na listagem.
    await expect(this.botaoSalvar).toBeHidden();
    await this.localizarLinhaDaPessoa(novoNome);
  }

  async deletarPessoa(nome: string){
    // Arrange — encontra a linha da pessoa a remover.
    const linha = await this.localizarLinhaDaPessoa(nome);

    // Act — aciona a exclusão e confirma no modal.
    await linha.getByRole('button', { name: 'Deletar' }).click();
    const modalConfirmacao = this.page.getByRole('dialog', { name: 'Deletar Pessoa' });
    await expect(modalConfirmacao).toBeVisible();
    await expect(modalConfirmacao.getByText('Tem certeza que deseja')).toBeVisible();
    await modalConfirmacao.getByRole('button', { name: 'Confirmar' }).click();

    // Assert — o modal fecha após confirmar a exclusão.
    await expect(modalConfirmacao).toBeHidden();
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
