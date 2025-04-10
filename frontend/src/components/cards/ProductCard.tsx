import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getProductTagVariant } from "@/utils/getVariants/getProductTagVariant";
import { Badge } from "../ui/badge";
import { ImageHandler } from "../ui/tables/columns/components/ImageHandler";

export function ProductCard({ product }: { product: any }) {
  const discountVariant =
    (product.discount > 0 && product.discount <= 10 && "bg-primary") ||
    (product.discount > 10 && product.discount <= 20 && "bg-yellow-600") ||
    (product.discount > 20 && product.discount <= 30 && "bg-orange-600") ||
    (product.discount > 30 && "bg-red-600");

  const borderCard =
    (product.discount > 0 && product.discount <= 10 && "border-primary") ||
    (product.discount > 10 && product.discount <= 20 && "border-yellow-500") ||
    (product.discount > 20 && product.discount <= 30 && "border-orange-400") ||
    (product.discount > 30 && "border-red-400");

  const style = {
    discountVariant,
    borderCard,
  };
  return (
    <Card
      className={cn(
        "overflow-hidden bg-white p-0 hover:bg-white gap-0",
        style.borderCard
      )}
    >
      <CardHeader className="relative w-full overflow-hidden bg-white p-0 text-black">
        {product.discount > 0 && (
          <div
            className={cn(
              "absolute right-2 top-2 z-10 rounded-lg text-white py-1 text-xs md:text-sm font-bold px-2",
              style.discountVariant
            )}
          >
            - {product.discount} %
          </div>
        )}
        <ImageHandler
          src={""}
          alt={product.name ?? ""}
          className="w-full object-cover border-b"
        />
      </CardHeader>
      <CardContent className="sm:px-4 py-0 px-2">
        <div className="flex items-center gap-2 capitalize mb-1">
          {product.tags.map((tag: string) => (
            <a
              href={`/products?tag=${tag}`}
              key={tag}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                className="rounded-lg text-xs px-2 py-1 hover:bg-none"
                variant={getProductTagVariant(tag)}
              >
                {tag}
              </Badge>
            </a>
          ))}
        </div>
        <CardTitle
          className="line-clamp-2 h-[48px] min-h-[48px] text-base text-black font-medium"
          title={product.name ?? ""}
        >
          {product.name}
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-black">
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
        <Button
          size="lg"
          className="w-full text-sm text-white md:text-base rounded-lg"
          variant="primary"
        >
          Réserver
        </Button>
      </CardFooter>
    </Card>
  );
}
