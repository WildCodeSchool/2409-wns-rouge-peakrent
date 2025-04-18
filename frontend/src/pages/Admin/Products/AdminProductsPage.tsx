import { Button } from "@/components/ui/button";
import ProductsTable from "./ProductsTable";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdminProductsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Produits
        </h1>
        <Button onClick={() => navigate("create")}>
          <Plus size={16} className="mr-2" />
          Nouveau produit
        </Button>
      </div>
      <section className="mt-5">
        <ProductsTable />
      </section>
    </div>
  );
}
