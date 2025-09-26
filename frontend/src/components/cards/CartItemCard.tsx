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
import { useModal } from "@/context/modalProvider";
import { OrderItem as OrderItemType } from "@/gql/graphql";
import { getDurationInDays, getPriceFixed } from "@/utils";
import { formatLocaleDate } from "@/utils/getLocaleDateAndTime";
import { ChevronsRight, X } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: OrderItemType;
  onRemoveItem?: () => void;
  onQuantityChange?: (quantity: number) => void;
  onDateChange?: (isStartDate: boolean, endDate: string) => void;
}

export function CartItemCard({
  item,
  onRemoveItem,
  onQuantityChange,
  onDateChange,
}: CartItemProps) {
  const { setIsOpen } = useModal();
  const handleRemoveItem = () => {
    if (onRemoveItem) {
      onRemoveItem();
    }
  };

  const handleDateChange = (isStartDate: boolean, endDate: string) => {
    if (onDateChange) {
      onDateChange(isStartDate, endDate);
    }
  };

  const handleChangeQuantity = (quantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(quantity);
    }
  };

  const variant = item.variant;
  const product = variant?.product;
  const numberOfDays = getDurationInDays(item.startsAt, item.endsAt);
  return (
    <Card className="grid grid-cols-[1fr_2fr] rounded-md border shadow-sm p-0 gap-2 max-w-screen-sm">
      <ImageHandler
        src={product?.urlImage}
        alt={product?.name ?? ""}
        className="w-full h-full object-cover border-r"
      />
      <div className="flex-1 p-2 pr-4 flex flex-col justify-between relative w-full overflow-hidden">
        {onRemoveItem && (
          <Button
            onClick={handleRemoveItem}
            type="button"
            variant="ghost"
            className="absolute top-3 right-3 p-0 h-fit hover:cursor-pointer transition-colors hover:bg-background"
            aria-label="Retirer du panier"
          >
            <X className="size-6 transition-colors text-muted-foreground hover:text-primary" />
          </Button>
        )}

        <div>
          <div className="w-full max-w-[calc(100%-2.5rem)] pt-2">
            <Link
              to={`/products/${variant?.product.id ?? ""}`}
              title={product?.name ?? ""}
              className="hover:underline"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <h3 className="font-semibold text-lg truncate">
                {product?.name ?? ""}
              </h3>
            </Link>
          </div>
          <div className="w-full max-w-full pb-2">
            <p
              className="text-base font-medium text-muted-foreground truncate"
              title={product?.sku ?? ""}
            >
              {product?.sku ?? ""}
            </p>
            <p className="text-sm font-normal flex gap-1 items-center my-3 flex-wrap">
              {!onDateChange ? (
                <>
                  <time
                    className="text-sm font-normal"
                    dateTime={item.startsAt}
                  >
                    {formatLocaleDate(item.startsAt).date}
                  </time>
                  <ChevronsRight className="size-4" />
                  <time className="text-sm font-normal" dateTime={item.endsAt}>
                    {formatLocaleDate(item.endsAt).date}
                  </time>
                </>
              ) : (
                <>
                  <input
                    type="date"
                    className="text-sm font-normal"
                    value={new Date(item.startsAt).toLocaleDateString("en-CA")}
                    onChange={(e) => handleDateChange?.(true, e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <ChevronsRight className="size-4" />
                  <input
                    type="date"
                    className="text-sm font-normal"
                    value={new Date(item.endsAt).toLocaleDateString("en-CA")}
                    onChange={(e) => handleDateChange?.(false, e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 pb-0">
          <span className="self-end mb-[0.2rem]">Taille: {variant?.size}</span>
          <div className="flex flex-col items-end justify-end text-sm md:text-base gap-1">
            <p className="text-sm font-normal sm:gap-1 flex flex-col sm:flex-row items-center order-1 sm:order-2">
              <span className="text-muted-foreground">
                ({item.quantity} x {getPriceFixed(item.pricePerDay)}€ x{" "}
                {numberOfDays}j)
              </span>
              <span className="font-bold text-lg self-end">
                {getPriceFixed(item.pricePerDay, item.quantity, numberOfDays)} €
              </span>
            </p>
            <Select
              value={item.quantity?.toString()}
              onValueChange={(value) => handleChangeQuantity(Number(value))}
              defaultValue={item.quantity?.toString()}
            >
              <SelectTrigger
                className="w-16 hover:cursor-pointer order-2 sm:order-1"
                disabled={!onQuantityChange}
              >
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
