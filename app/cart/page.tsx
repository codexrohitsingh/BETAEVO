import { CartDrawer } from "@/components/cart/page";
import { Hero } from "@/components/home/hero";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { TrustMetrics } from "@/components/home/trust-metrics";
import { Navbar } from "@/components/layout/navbar";
import { getCartImpl } from "@/lib/product-service";

export default async function Cart() {
  const cart = await getCartImpl();
  const items = cart?.items || [];

  return (
    <>
      <Navbar />
      <Hero />
            <TrustMetrics />
            <ShopByCategory/>
      <CartDrawer items={items} />
    </>
  );
}
