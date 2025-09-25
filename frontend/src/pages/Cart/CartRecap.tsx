import { CartItemCard } from "@/components/cards";
import { Order, OrderItem } from "@/gql/graphql";
import { GET_ORDER_BY_REF } from "@/graphQL";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

export function CartRecap() {
  const { ref } = useParams();
  const {
    data: orderData,
    loading: loadingCommand,
    error: errorOrder,
  } = useQuery(gql(GET_ORDER_BY_REF), {
    variables: { reference: ref },
    skip: !ref,
  });

  const order: Order = orderData?.getOrderByReference;

  return (
    <div className="lg:col-span-8 space-y-4">
      {order?.orderItems?.map((item: OrderItem) => (
        <div key={item.id} className="w-full">
          <CartItemCard item={item} />
        </div>
      ))}
    </div>
  );
}
