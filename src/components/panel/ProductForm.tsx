import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import { saveProductAction } from "@/app/actions/panel";
import { ActionForm } from "./ActionForm";
import { ImageField } from "./ImageField";
import { SubmitButton } from "@/components/SubmitButton";

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  return (
    <ActionForm action={saveProductAction} className="grid gap-6 lg:grid-cols-3">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="space-y-6 lg:col-span-2">
        <div className="card space-y-5 p-6">
          <div>
            <label className="label" htmlFor="name">Nombre del producto *</label>
            <input id="name" name="name" required defaultValue={product?.name} className="input" placeholder="Ej. Chompa de alpaca tejida a mano" />
          </div>
          <div>
            <label className="label" htmlFor="description">Descripción</label>
            <textarea id="description" name="description" rows={5} defaultValue={product?.description} className="input" placeholder="Material, tallas, medidas, beneficios..." />
          </div>
        </div>
        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="price">Precio (S/) *</label>
            <input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="label" htmlFor="salePrice">Precio de oferta (S/)</label>
            <input id="salePrice" name="salePrice" type="number" step="0.01" min="0" defaultValue={product?.salePrice ?? ""} className="input" placeholder="Opcional" />
          </div>
          <div>
            <label className="label" htmlFor="stock">Stock disponible</label>
            <input id="stock" name="stock" type="number" min="0" defaultValue={product?.stock ?? 10} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="sku">SKU / Código</label>
            <input id="sku" name="sku" defaultValue={product?.sku ?? ""} className="input" placeholder="Opcional" />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="card p-6">
          <ImageField label="Imagen del producto" fileName="imageFile" urlName="imageUrl" current={product?.imageUrl} />
        </div>
        <div className="card space-y-4 p-6">
          <div>
            <label className="label" htmlFor="categoryId">Categoría</label>
            <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""} className="input">
              <option value="">Sin categoría</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-brand-600" /> Visible en la tienda
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-brand-600" /> Producto destacado
          </label>
        </div>
        <div className="flex gap-2">
          <Link href="/panel/productos" className="btn-outline flex-1">Cancelar</Link>
          <SubmitButton className="btn-primary flex-1">{product ? "Guardar cambios" : "Crear producto"}</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}
