import { getStoreBySlug } from "@/lib/store";
import { enabledPayments } from "@/lib/shop";
import { Checkout } from "@/components/store/Checkout";

export const metadata = { title: "Finalizar compra" };

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);
  return (
    <Checkout
      store={{
        slug: store.slug,
        shippingLima: store.shippingLima,
        shippingProvince: store.shippingProvince,
        freeShippingFrom: store.freeShippingFrom,
        pickupEnabled: store.pickupEnabled,
        address: store.address,
        couponsEnabled: store.plan !== "gratis",
        payments: enabledPayments(store),
      }}
    />
  );
}
