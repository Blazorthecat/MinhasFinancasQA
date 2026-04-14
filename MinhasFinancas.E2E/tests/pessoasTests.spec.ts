import { test, expect } from '@playwright/test';
import { pessoasPage } from '../pages/pessoasPage.ts';

const nomesParaTeste = {
  pessoa1: 'João Silva',
  pessoa2: 'Maria Souza',
};

test.beforeEach(async ({ page }) => {
  await page.goto('/pessoas');
});

test('pagina de pessoas abre e exibe todos os itens necessarios corretamente', async ({ page }) => {
  const pessoas = new pessoasPage(page);
  await pessoas.pageIsLoadedCorrectly();
});

test.describe.serial('Fluxo de Gerenciamento de Pessoas', () => {

  test('deve exibir a página corretamente', async ({ page }) => {
    const pessoas = new pessoasPage(page);
    await pessoas.pageIsLoadedCorrectly();
  });

  test('deve adicionar uma nova pessoa', async ({ page }) => {
    const pessoas = new pessoasPage(page);
    await pessoas.adicionarNovaPessoa(nomesParaTeste.pessoa1);
  });

  test('deve editar a pessoa cadastrada', async ({ page }) => {
    const pessoas = new pessoasPage(page);
    await pessoas.editarPessoa(nomesParaTeste.pessoa1, nomesParaTeste.pessoa2);
  });

  test('deve deletar a pessoa', async ({ page }) => {
    const pessoas = new pessoasPage(page);
    await pessoas.deletarPessoa(nomesParaTeste.pessoa2);
  });
});