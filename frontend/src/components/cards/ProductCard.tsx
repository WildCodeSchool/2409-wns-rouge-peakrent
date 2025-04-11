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
import { getDiscountStyles } from "@/utils/getDiscountStyles";
import { getProductTagVariant } from "@/utils/getVariants/getProductTagVariant";
import { NavLink } from "react-router-dom";

export function ProductCard({ product }: { product: any }) {
  const { discountColor, discountBorder } = getDiscountStyles(product.discount);

  return (
    <Card
      className={cn(
        "overflow-hidden bg-white p-0 hover:bg-white gap-0",
        discountBorder
      )}
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
          className="w-full object-cover border-b"
        />
      </CardHeader>
      <CardContent className="sm:px-4 py-0 px-2">
        {/* <div className="flex items-center gap-2 capitalize mb-1">
          {product.tags.map((tag: string) => (
            <NavLink
              to={`/products?tag=${tag}`}
              key={tag}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                className="rounded-lg text-xs md:text-sm px-2 py-1 hover:bg-none"
                variant={getProductTagVariant(tag)}
              >
                {tag}
              </Badge>
            </NavLink>
          ))}
        </div> */}
        <CardTitle
          className="line-clamp-2 h-[48px] min-h-[48px] md:h-[56px] md:min-h-[56px] text-base md:text-lg text-black font-medium"
          title={product.name ?? ""}
        >
          {product.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm md:text-base text-black">
          {product.discount > 0 && (
            <p className="line-through text-muted-foreground">
              {(product.price / 100).toFixed(2)}€/j
            </p>
          )}
          <p className="font-bold ml-auto mt-1">
            {((product.price * (1 - product.discount / 100)) / 100).toFixed(2)}
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
