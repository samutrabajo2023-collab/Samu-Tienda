import { test, expect } from "@playwright/test";
import { DEMO, expectNoHorizontalScroll } from "./helpers";

test.describe("Tienda pública (comprador)", () => {
  test("home de la tienda", async ({ page }) => {
    await page.goto(`/t/${DEMO.slug}`);
    await expect(page.getByText("Alpaca Andina").first()).toBeVisible();
    await expect(page.getByText("Chalina de Alpaca").first()).toBeVisible();
    await expectNoHorizontalScroll(page);
  });

  test("producto agotado no se puede comprar", async ({ page }) => {
    await page.goto(`/t/${DEMO.slug}`);
    await page.getByText("Peluche de Alpaca").first().click();
    await expect(page.getByRole("button", { name: "Producto agotado" })).toBeDisabled();
  });

  test("compra completa con cupón y envío a Lima", async ({ page }) => {
    await page.goto(`/t/${DEMO.slug}`);
    await page.getByText("Chalina de Alpaca").first().click();
    await expect(page).toHaveURL(/\/p\//);
    await page.getByRole("button", { name: "Agregar al carrito" }).first().click();
    await expect(page.getByRole("button", { name: "✓ Agregado al carrito" })).toBeVisible();

    await page.goto(`/t/${DEMO.slug}/carrito`);
    await expect(page.getByRole("heading", { name: "Tu carrito" })).toBeVisible();
    await expect(page.getByText("S/ 69.00").first()).toBeVisible();
    await page.getByRole("link", { name: "Continuar compra" }).click();

    await expect(page.getByRole("heading", { name: "Finalizar compra" })).toBeVisible();
    await page.getByPlaceholder("Código de cupón").fill("bienvenido10");
    await page.getByRole("button", { name: "Aplicar" }).click();
    await expect(page.getByText("Cupón BIENVENIDO10 aplicado.")).toBeVisible();

    await page.locator('input[name="name"]').fill("Lucía Compradora");
    await page.locator('input[name="phone"]').fill("912345678");
    await page.locator('input[name="district"]').fill("Miraflores");
    await page.locator('input[name="address"]').fill("Av. Larco 123");

    // 69.00 - 10% (6.90) + envío Lima 10.00 = 72.10
    await expect(page.getByText("- S/ 6.90")).toBeVisible();
    await expect(page.getByText("S/ 72.10")).toBeVisible();

    await page.getByRole("button", { name: "Confirmar pedido" }).click();
    await expect(page).toHaveURL(/\/pedido\//);
    await expect(page.getByRole("heading", { name: "¡Gracias por tu compra, Lucía!" })).toBeVisible();
    await expect(page.getByText("S/ 72.10").first()).toBeVisible();
  });

  test("cupón inválido muestra error", async ({ page }) => {
    await page.goto(`/t/${DEMO.slug}`);
    await page.getByText("Chalina de Alpaca").first().click();
    await page.getByRole("button", { name: "Comprar ahora" }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await page.getByPlaceholder("Código de cupón").fill("NOEXISTE");
    await page.getByRole("button", { name: "Aplicar" }).click();
    await expect(page.locator("p.text-red-600")).toBeVisible();
  });
});
