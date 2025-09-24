import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Product } from "@/gql/graphql";

export default function ProductHeader({
  handleReset,
  isPending,
  product,
}: {
  handleReset: () => void;
  isPending: boolean;
  product?: Product | null;
}) {
  return (
    <div className="flex items-center gap-4">
      <h1
        className="max-w-[450px] truncate text-xl font-semibold lg:max-w-[550px]"
        title={product?.name ?? "Nouveau produit"}
      >
        {product?.name ?? "Nouveau produit"}
      </h1>
      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        {/* <SearchReference /> */}
        <Button
          type="reset"
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={isPending}
        >
          Réinitialiser
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? <LoadIcon size={24} /> : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
