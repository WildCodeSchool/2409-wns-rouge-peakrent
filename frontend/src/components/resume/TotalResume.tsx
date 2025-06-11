import { OrderItem } from "@/gql/graphql";

type TotalResumeType = {
  orderItems: OrderItem[];
  promo: number;
  className?: string;
};

const TotalResume = ({ orderItems, promo, className }: TotalResumeType) => {
  const calculateSubTotal = () => {
    let result = 0;
    for (const item of orderItems) {
      const totalDays =
        item?.endsAt && item?.startsAt
          ? Math.floor(
              (new Date(item.endsAt).getTime() -
                new Date(item.startsAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 1;

      result += totalDays * item.quantity * item.pricePerHour;
    }
    return result;
  };

  const subTotal = calculateSubTotal();
  const total = subTotal - promo;

  return (
    <div
      className={`border rounded-xs bg-gray-100 p-4 w-full lg:max-w-[350px] ${className}`}
    >
      <h2 className="text-center">Résumé</h2>
      <p className="flex justify-between">
        Sous-total <span>{(subTotal / 100).toFixed(2)} €</span>
      </p>
      <hr className="border-t-2 border-gray-300 my-2" />
      <p className="flex justify-between">
        Promo <span>{promo} €</span>
      </p>
      <hr className="border-t-2 border-gray-300 my-2" />
      <p className="flex justify-between">
        Total <span>{(total / 100).toFixed(2)} €</span>
      </p>
    </div>
  );
};

export default TotalResume;
