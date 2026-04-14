import { test } from '@playwright/test';
import { dashboardPage } from '../pages/dashboardPage.ts';

test('dashboard abre e exibe todos os itens necessarios corretamente', async ({ page }) => {
  await page.goto('/');
  const dashboard = new dashboardPage(page);
  await dashboard.pageIsLoadedCorrectly();
});