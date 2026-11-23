import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test.describe("Panel de la tienda demo", () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test("dashboard muestra métricas", async ({ page }) => {
    for (const label of ["Ventas del mes", "Pedidos del mes", "Ticket promedio", "Productos"]) {
      await expect(page.getByRole("main").getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByText("Últimos pedidos")).toBeVisible();
  });

  test("lista de productos", async ({ page }) => {
    await page.goto("/panel/productos");
    await expect(page.getByText("Chompa de Alpaca Clásica").first()).toBeVisible();
    await expect(page.getByText("Peluche de Alpaca").first()).toBeVisible();
  });

  test("cambiar estado de un pedido", async ({ page }) => {
    await page.goto("/panel/pedidos");
    await page.locator('a[href^="/panel/pedidos/"]').first().click();
    await expect(page.getByRole("heading", { name: "Actualizar estado" })).toBeVisible();
    const enviado = page.getByRole("button", { name: "Enviado", exact: true });
    if (await enviado.isDisabled()) await page.getByRole("button", { name: "Entregado", exact: true }).click();
    else await enviado.click();
    await expect(page.locator("button:disabled").filter({ hasText: /^(Enviado|Entregado)$/ })).toBeVisible();
  });

  test("crear cupón", async ({ page }, info) => {
    const code = `E2E${info.project.name.toUpperCase().slice(0, 3)}${Date.now() % 100000}`;
    await page.goto("/panel/cupones");
    await page.locator("#code").fill(code);
    await page.locator("#value").fill("15");
    await page.getByRole("button", { name: "Crear cupón" }).click();
    await expect(page.getByText(`Cupón ${code} creado.`)).toBeVisible();
    await expect(page.getByText(code).nth(1)).toBeVisible();
  });

  test("guardar configuración", async ({ page }) => {
    await page.goto("/panel/configuracion");
    await page.getByRole("button", { name: /Guardar/ }).click();
    await expect(page.getByText("Configuración guardada.")).toBeVisible();
  });
});
