import { test } from '@playwright/test';
import { categoriasPage } from '../pages/categoriasPage.ts';

test('pagina de categorias abre e exibe todos os itens necessarios corretamente', async ({ page }) => {
  await page.goto('/categorias');
  const categorias = new categoriasPage(page);
  await categorias.pageIsLoadedCorrectly();
});

test('adicionar nova categoria do tipo despesa', async ({ page }) => {
  await page.goto('/categorias');
  const categorias = new categoriasPage(page);
  await categorias.adicionarNovaCategoria('Despesa');
});

test('adicionar nova categoria do tipo receita', async ({ page }) => {
  await page.goto('/categorias');
  const categorias = new categoriasPage(page);
  await categorias.adicionarNovaCategoria('Receita');
});

test('adicionar nova categoria do tipo ambas', async ({ page }) => {
  await page.goto('/categorias');
  const categorias = new categoriasPage(page);
  await categorias.adicionarNovaCategoria('Ambas');
});

test('paginação da tabela de categorias', async ({ page }) => {
  await page.goto('/categorias');
  const categorias = new categoriasPage(page);
  await categorias.paginaAnteriorDesabilitada();
  await categorias.proximaPaginaDaTabela();
  while (await categorias.proximaPagina.isEnabled()) {
    await categorias.proximaPaginaDaTabela();
  }
  await categorias.proximaPaginaDesabilitada();
  await categorias.paginaAnteriorDaTabela();
  while (await categorias.paginaAnterior.isEnabled()) {
    await categorias.paginaAnteriorDaTabela();
  }
  await categorias.paginaAnteriorDesabilitada();
});