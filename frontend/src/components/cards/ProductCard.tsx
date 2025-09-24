import { Badge, BadgeVariantType } from "@/components/ui/badge";
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
import { NavLink, useNavigate } from "react-router-dom";

export function ProductCard({ product }: { product: any }) {
  const { discountColor, discountBorder } = getDiscountStyles(product.discount);
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "overflow-hidden bg-white cursor-pointer flex flex-col",
        "w-[260px] h-[460px] py-0 gap-0",
        discountBorder
      )}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <CardHeader className="relative p-0">
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
          className="w-full h-[240px] object-cover border-b"
        />
      </CardHeader>

      <CardContent className="px-3 py-2 flex-1 flex flex-col">
        <div className="flex items-center gap-2 capitalize mb-1">
          {getCategories(product)?.map((category) => (
            <NavLink
              to={`/products?activities=${category.name}`}
              key={category.id}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                className="rounded-lg text-xs md:text-sm px-2 py-1"
                variant={(category.variant as BadgeVariantType) ?? "neutral"}
              >
                {category.name}
              </Badge>
            </NavLink>
          ))}
        </div>

        <CardTitle
          className="line-clamp-2 min-h-[48px] text-base md:text-lg text-black font-medium"
          title={product.name ?? ""}
        >
          {product.name}
        </CardTitle>

        <div className="mt-auto">
          {product.discount > 0 && (
            <p className="line-through text-muted-foreground text-sm">
              {getPriceRange(product)}€
            </p>
          )}
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-muted-foreground leading-none mb-1">
              À partir de
            </span>
            <span className="font-bold text-base md:text-lg leading-none">
              {getPriceRange(product, true)}€
            </span>
            <span className="text-[11px] text-muted-foreground leading-none mt-1">
              par jour
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-2">
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
