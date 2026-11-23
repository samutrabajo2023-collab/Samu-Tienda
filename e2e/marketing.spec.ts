import { test, expect } from "@playwright/test";
import { expectNoHorizontalScroll } from "./helpers";

test.describe("Sitio público", () => {
  test("landing carga y lleva al registro", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/Samu Tienda/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalScroll(page);
    await page.locator('a[href="/registro"]').first().click();
    await expect(page).toHaveURL(/\/registro/);
    await expect(page.getByRole("button", { name: "Crear mi cuenta gratis" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("precios muestra los 4 planes", async ({ page }) => {
    await page.goto("/precios");
    await expect(page.getByRole("heading", { name: "Elige el plan ideal para tu negocio" })).toBeVisible();
    for (const plan of ["Gratis", "Emprendedor", "Pyme", "Pro"]) {
      await expect(page.getByText(plan, { exact: true }).first()).toBeVisible();
    }
    await expectNoHorizontalScroll(page);
  });

  test("ruta inexistente muestra 404", async ({ page }) => {
    const res = await page.goto("/esta-pagina-no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Página no encontrada" })).toBeVisible();
  });

  test("tienda inexistente muestra 404", async ({ page }) => {
    const res = await page.goto("/t/tienda-que-no-existe-xyz");
    expect(res?.status()).toBe(404);
  });
});
