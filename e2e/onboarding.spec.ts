import { test, expect } from "@playwright/test";

test("emprendedor nuevo: registro → crea tienda → publica producto", async ({ page }, info) => {
  const id = `${Date.now()}${info.project.name}`;
  const email = `e2e-${id}@test.pe`;
  const storeName = `Tienda E2E ${id}`;
  const slug = `tienda-e2e-${id}`;

  await page.goto("/registro");
  await page.getByLabel("Nombre completo").fill("Rosa Prueba");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill("secreto123");
  await page.getByRole("button", { name: "Crear mi cuenta gratis" }).click();
  await expect(page).toHaveURL(/\/panel\/crear-tienda/);

  await page.getByLabel("Nombre de tu tienda").fill(storeName);
  await expect(page.getByLabel("Dirección de tu tienda")).toHaveValue(slug);
  await page.getByLabel("WhatsApp para pedidos").fill("987654321");
  await page.getByRole("button", { name: /Crear mi tienda/ }).click();
  await expect(page).toHaveURL(/\/panel\?bienvenida=1/);
  await expect(page.getByText(`¡Tu tienda ${storeName} ya está online!`)).toBeVisible();

  await page.goto("/panel/productos/nuevo");
  await page.getByLabel("Nombre").first().fill("Mermelada de Aguaymanto");
  await page.locator("#price").fill("18.50");
  await page.locator("#stock").fill("20");
  await page.getByRole("button", { name: "Crear producto" }).click();
  await expect(page).toHaveURL(/\/panel\/productos$/);
  await expect(page.getByText("Mermelada de Aguaymanto")).toBeVisible();

  await page.goto(`/t/${slug}`);
  await expect(page.getByText(storeName).first()).toBeVisible();
  await expect(page.getByText("Mermelada de Aguaymanto")).toBeVisible();
  await expect(page.getByText("S/ 18.50").first()).toBeVisible();
});
