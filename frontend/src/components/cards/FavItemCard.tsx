import { Badge, BadgeVariantType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { Product as ProductType } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { getCategories } from "@/utils/getCategories";
import { getPriceRange } from "@/utils/getPriceRange";
import { Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

interface FavItemProps {
  product: ProductType & { discount: number };
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  isFavorite: boolean;
}

//TODO remove & { discount: number } when discount is implemented

export function FavItemCard({
  product,
  onToggleFavorite,
  isFavorite,
}: FavItemProps) {
  const handleToggleFavorite = () => {
    onToggleFavorite(product.id, !isFavorite);
  };

  return (
    <Card className="grid grid-cols-[1fr_2fr] rounded-md border shadow-sm p-0 gap-2 max-w-screen-sm">
      <ImageHandler
        src={product.urlImage}
        alt={product.name}
        className="w-full h-full object-cover border-r"
      />
      <div className="flex-1 p-2 pr-4 flex flex-col justify-between relative w-full overflow-hidden">
        <Button
          onClick={handleToggleFavorite}
          type="button"
          variant="ghost"
          className="absolute top-2 right-3 p-1 rounded-full hover:cursor-pointer transition-colors hover:bg-background"
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
        >
          <Heart
            className={cn(
              "size-6 transition-colors",
              isFavorite
                ? "fill-red-700 text-red-700 hover:fill-red-600 hover:text-red-600"
                : "text-white hover:text-white"
            )}
          />
        </Button>

        <div className="w-full max-w-[calc(100%-2.5rem)] pt-2">
          <h3 className="font-semibold text-lg truncate" title={product.name}>
            {product.name}
          </h3>
        </div>
        <div className="w-full max-w-full pb-2">
          <p
            className="text-base font-medium text-muted-foreground truncate"
            title={product.sku}
          >
            {product.sku}
          </p>
          <p
            className="text-sm line-clamp-2 my-3 font-normal"
            title={product.description ?? ""}
          >
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center self-end gap-2 capitalize mb-1">
            {getCategories(product)
              ?.slice(0, 1)
              .map((category) => (
                <NavLink
                  to={`/products?activities=${category.name}`}
                  key={category.id}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    className="rounded-lg text-xs md:text-sm px-2 py-1"
                    variant={
                      (category.variant as BadgeVariantType) ?? "neutral"
                    }
                  >
                    {category.name}
                  </Badge>
                </NavLink>
              ))}
          </div>
          <div className="flex items-center text-sm md:text-base flex-col">
            {product.discount > 0 && (
              <p className="line-through text-muted-foreground mt-1">
                {getPriceRange(product)}€/j
              </p>
            )}
            <p className="font-bold ml-auto mt-1">
              {getPriceRange(product, true)}
              €/j
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
