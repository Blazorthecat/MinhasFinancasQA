import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { pessoasPage } from '../pages/pessoasPage.ts';

// Nomes ÚNICOS por execução: o backend é compartilhado entre os navegadores e
// entre execuções repetidas. Nomes fixos causavam corrida (um navegador
// renomeava/excluía o registro que o outro procurava). O sufixo aleatório
// isola os dados de cada execução/projeto.
const sufixo = faker.string.alphanumeric(6);
const nomesParaTeste = {
  pessoa1: `AAA ${sufixo} Silva`,
  pessoa2: `AAA ${sufixo} Souza`,
};

test.beforeEach(async ({ page }) => {
  await page.goto('/pessoas');
});

test('pagina de pessoas abre e exibe todos os itens necessarios corretamente', async ({ page }) => {
  // Arrange
  const pessoas = new pessoasPage(page);
  // Act + Assert — todos os elementos essenciais da página estão visíveis.
  await pessoas.pageIsLoadedCorrectly();
});

test.describe.serial('Fluxo de Gerenciamento de Pessoas', () => {

  test('deve exibir a página corretamente', async ({ page }) => {
    // Arrange
    const pessoas = new pessoasPage(page);
    // Act + Assert
    await pessoas.pageIsLoadedCorrectly();
  });

  test('deve adicionar uma nova pessoa', async ({ page }) => {
    // Arrange
    const pessoas = new pessoasPage(page);
    // Act — cadastra a pessoa com nome único.
    // Assert — feito dentro do método (formulário fecha após salvar).
    await pessoas.adicionarNovaPessoa(nomesParaTeste.pessoa1);
  });

  test('deve editar a pessoa cadastrada', async ({ page }) => {
    // Arrange
    const pessoas = new pessoasPage(page);
    // Act — localiza a pessoa criada e renomeia.
    // Assert — feito dentro do método (formulário fecha após salvar).
    await pessoas.editarPessoa(nomesParaTeste.pessoa1, nomesParaTeste.pessoa2);
  });

  test('deve deletar a pessoa', async ({ page }) => {
    // Arrange
    const pessoas = new pessoasPage(page);
    // Act — localiza a pessoa (já renomeada) e exclui.
    // Assert — feito dentro do método (modal de confirmação fecha após confirmar).
    await pessoas.deletarPessoa(nomesParaTeste.pessoa2);
  });
});
