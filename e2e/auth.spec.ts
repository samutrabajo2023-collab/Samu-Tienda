import { test, expect } from "@playwright/test";
import { DEMO, login } from "./helpers";

test.describe("Autenticación", () => {
  test("el panel exige iniciar sesión", async ({ page }) => {
    await page.goto("/panel/productos");
    await expect(page).toHaveURL(/\/login/);
  });

  test("contraseña incorrecta muestra error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(DEMO.email);
    await page.getByLabel("Contraseña").fill("incorrecta");
    await page.getByRole("button", { name: "Ingresar" }).click();
    await expect(page.getByText("Correo o contraseña incorrectos.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("login demo y cerrar sesión", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("heading", { name: "Resumen" })).toBeVisible();
    await page.getByRole("button", { name: "Cerrar sesión" }).locator("visible=true").first().click();
    await expect(page).not.toHaveURL(/\/panel/);
    await page.goto("/panel");
    await expect(page).toHaveURL(/\/login/);
  });

  test("registro con correo repetido muestra error", async ({ page }) => {
    await page.goto("/registro");
    await page.getByLabel("Nombre completo").fill("Otro Usuario");
    await page.getByLabel("Correo electrónico").fill(DEMO.email);
    await page.getByLabel("Contraseña").fill("secreto123");
    await page.getByRole("button", { name: "Crear mi cuenta gratis" }).click();
    await expect(page.getByText("Ya existe una cuenta con ese correo.")).toBeVisible();
  });
});
