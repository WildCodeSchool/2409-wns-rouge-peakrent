import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { cn } from "@/lib/utils";
import { getCategories } from "@/utils/getCategories";
import { getDiscountStyles } from "@/utils/getDiscountStyles";
import { getPriceRange } from "@/utils/getPriceRange";
import { getProductCategoryVariant } from "@/utils/getVariants/getProductCategoryVariant";
import { NavLink, useNavigate } from "react-router-dom";

export function ProductCard({ product }: { product: any }) {
  const { discountColor, discountBorder } = getDiscountStyles(product.discount);
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "overflow-hidden bg-white p-0 hover:bg-white gap-0 cursor-pointer",
        discountBorder
      )}
      onClick={() => {
        navigate(`/products/${product.id}`);
      }}
    >
      <CardHeader className="relative w-full overflow-hidden bg-white p-0 text-black">
        {product.discount > 0 && (
          <div
            className={cn(
              "absolute right-2 top-2 z-10 rounded-lg text-white py-1 text-xs md:text-sm font-bold px-2",
              discountColor
            )}
          >
            - {product.discount} %
          </div>
        )}
        <ImageHandler
          src={product.urlImage ?? ""}
          alt={product.name ?? ""}
          className="w-full object-cover border-b max-h-[200px] h-[200px] md:h-[250px] md:max-h-[250px]"
        />
      </CardHeader>
      <CardContent className="sm:px-4 py-0 px-2">
        <div className="flex items-center gap-2 capitalize mb-1">
          {getCategories(product)?.map((category: string) => (
            <NavLink
              to={`/products?activities=${category}`}
              key={category}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                className="rounded-lg text-xs md:text-sm px-2 py-1"
                variant={getProductCategoryVariant(category?.toLowerCase())}
              >
                {category}
              </Badge>
            </NavLink>
          ))}
        </div>
        <CardTitle
          className="line-clamp-2 h-[48px] min-h-[48px] md:h-[56px] md:min-h-[56px] text-base md:text-lg text-black font-medium"
          title={product.name ?? ""}
        >
          {product.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm md:text-base text-black">
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
      </CardContent>
      <CardFooter className="sm:p-4 p-2 sm:pt-2">
        <NavLink
          to={`/products/${product.id}`}
          className="w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            className="w-full text-sm text-white md:text-base rounded-lg"
            variant="primary"
          >
            Réserver
          </Button>
        </NavLink>
      </CardFooter>
    </Card>
  );
}
