import Hero from "../../components/Hero/Hero";
import ProductsPage from "../Products/ProductsPage";

export default function HomeProducts() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
      <Hero />
      <div className="mt-6">
        <ProductsPage />
      </div>
    </div>
  );
}
