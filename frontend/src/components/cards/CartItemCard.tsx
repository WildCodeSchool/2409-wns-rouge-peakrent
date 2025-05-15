import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selectWithoutForm";
import { ImageHandler } from "@/components/ui/tables/columns/components/ImageHandler";
import { OrderItem } from "@/gql/graphql";
import { formatLocaleDate } from "@/utils/getLocaleDateAndTime";
import { totalDays } from "@/utils/getNumberOfDays";
import { ChevronsRight, X } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: OrderItem;
  onRemoveItem: () => void;
  onQuantityChange: (value: string) => void;
}

//TODO remove & { discount: number } when discount is implemented

export function CartItemCard({
  item,
  onRemoveItem,
  onQuantityChange,
}: CartItemProps) {
  const handleRemoveItem = () => {
    onRemoveItem();
  };

  const handleChangeQuantity = (quantity: number) => {
    onQuantityChange(quantity.toString());
  };

  const numberOfDays = totalDays(item.startsAt, item.endsAt);

  return (
    <Card className="grid grid-cols-[1fr_2fr] rounded-md border shadow-sm p-0 gap-2 max-w-screen-sm">
      <ImageHandler
        src={item.variant?.product.urlImage}
        alt={item.variant?.product.name ? item.variant?.product.name : ""}
        className="w-full h-full object-cover border-r"
      />
      <div className="flex-1 p-2 pr-4 flex flex-col justify-between relative w-full overflow-hidden">
        <Button
          onClick={handleRemoveItem}
          type="button"
          variant="ghost"
          className="absolute top-2 right-3 p-1 rounded-full hover:cursor-pointer transition-colors hover:bg-background"
          aria-label="Retirer du panier"
        >
          <X className="size-6 transition-colors text-muted-foreground hover:text-primary" />
        </Button>

        <div>
          <div className="w-full max-w-[calc(100%-2.5rem)] pt-2">
            <h3 className="font-semibold text-lg truncate">
              <Link
                to={`/products/${item.variant?.product.id}`}
                title={item.variant?.product.name}
                className="hover:underline"
              >
                {item.variant?.product.name}
              </Link>
            </h3>
          </div>
          <div className="w-full max-w-full pb-2">
            <p
              className="text-base font-medium text-muted-foreground truncate"
              title={item.variant?.product.sku}
            >
              {item.variant?.product.sku}
            </p>
            <p className="text-sm font-normal flex gap-1 items-center my-3">
              {/* Ajoute la modification des dates */}
              <time className="text-sm font-normal" dateTime={item.startsAt}>
                {formatLocaleDate(item.startsAt).date}
              </time>
              <ChevronsRight className="size-4" />
              <time className="text-sm font-normal" dateTime={item.endsAt}>
                {formatLocaleDate(item.endsAt).date}
              </time>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 pb-2">
          <span className="self-end">Taille: {item.variant?.size}</span>
          <div className="flex flex-col items-end text-sm md:text-base gap-2">
            <p className="text-sm font-normal gap-2 flex flex-col sm:flex-row items-center order-1 sm:order-2">
              <span className="text-muted-foreground">
                ({item.quantity} x {(item.pricePerHour / 100).toFixed(2)}€ x{" "}
                {numberOfDays} jour
                {numberOfDays > 1 ? "s" : ""})
              </span>
              <span className="font-bold self-end text-lg">
                {(
                  (item.pricePerHour * item.quantity * numberOfDays) /
                  100
                ).toFixed(2)}
                €
              </span>
            </p>
            <Select
              value={item.quantity?.toString()}
              onValueChange={(value) => handleChangeQuantity(Number(value))}
              defaultValue={item.quantity?.toString()}
            >
              <SelectTrigger className="w-16 hover:cursor-pointer order-2 sm:order-1">
                <SelectValue className="text-sm md:text-base" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
