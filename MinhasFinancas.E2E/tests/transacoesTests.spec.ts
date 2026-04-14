import { test } from '@playwright/test';
import { transacoesPage } from '../pages/transacoesPage.ts';

test('pagina de transacoes abre e exibe todos os itens necessarios corretamente', async ({ page }) => {
  await page.goto('/transacoes');
  const transacoes = new transacoesPage(page);
  await transacoes.pageIsLoadedCorrectly();
});

test('adicionar nova transacao do tipo despesa', async ({ page }) => {
  await page.goto('/transacoes');
  const transacoes = new transacoesPage(page);
  await transacoes.adicionarNovaTransacao('Despesa');
});

test('adicionar nova transacao do tipo receita', async ({ page }) => {
  await page.goto('/transacoes');
  const transacoes = new transacoesPage(page);
  await transacoes.adicionarNovaTransacao('Receita');
});

test('paginacao da tabela de transacoes', async ({ page }) => {
  await page.goto('/transacoes');
    const transacoes = new transacoesPage(page);
    await transacoes.paginaAnteriorDesabilitada();
    await transacoes.proximaPaginaDaTabela();
    while (await transacoes.proximaPagina.isEnabled()) {
      await transacoes.proximaPaginaDaTabela();
    }
    await transacoes.proximaPaginaDesabilitada();
    await transacoes.paginaAnteriorDaTabela();
    while (await transacoes.paginaAnterior.isEnabled()) {
      await transacoes.paginaAnteriorDaTabela();
    }
    await transacoes.paginaAnteriorDesabilitada();
});
