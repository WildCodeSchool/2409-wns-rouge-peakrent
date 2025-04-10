import ProductsTable from "./ProductsTable";

export function AdminProductsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Produits</h1>
      <section className="mt-5">
        <ProductsTable />
      </section>
    </div>
  );
}
