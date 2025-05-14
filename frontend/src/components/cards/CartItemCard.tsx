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
import { formatLocaleDate } from "@/utils/getLocaleDateAndTime";
import { ChevronsRight, X } from "lucide-react";

interface CartItemProps {
  item: any;
  onRemoveItem: () => void;
  onQuantityChange: () => void;
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
    onQuantityChange();
  };

  //TODO: adapt it
  const totalDays =
    item?.endDate && item?.startDate
      ? Math.floor(
          (new Date(item?.endDate).getTime() -
            new Date(item?.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 1;

  return (
    <Card className="grid grid-cols-[1fr_2fr] rounded-md border shadow-sm p-0 gap-2 max-w-screen-sm">
      <ImageHandler
        src={item.urlImage}
        alt={item.name}
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
            <h3 className="font-semibold text-lg truncate" title={item.name}>
              {item.name}
            </h3>
          </div>
          <div className="w-full max-w-full pb-2">
            <p
              className="text-base font-medium text-muted-foreground truncate"
              title={item.sku}
            >
              {item.sku}
            </p>
            <p className="text-sm font-normal flex gap-1 items-center my-3">
              <time className="text-sm font-normal" dateTime={item.startDate}>
                {formatLocaleDate(item.startDate).date}
              </time>
              <ChevronsRight className="size-4" />
              <time className="text-sm font-normal" dateTime={item.endDate}>
                {formatLocaleDate(item.endDate).date}
              </time>
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 pb-2">
          <span className="self-end">Taille: {item.size}</span>
          <div className="flex flex-col items-end text-sm md:text-base gap-2">
            <p className="text-sm font-normal gap-2 flex flex-col sm:flex-row items-center order-1 sm:order-2">
              <span className="text-muted-foreground">
                ({item.quantity} x {item.pricePerHour?.toFixed(2)}€ x{" "}
                {totalDays} jour
                {totalDays > 1 ? "s" : ""})
              </span>
              <span className="font-bold self-end text-lg">
                {(item.pricePerHour * item.quantity * totalDays)?.toFixed(2)}€
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
