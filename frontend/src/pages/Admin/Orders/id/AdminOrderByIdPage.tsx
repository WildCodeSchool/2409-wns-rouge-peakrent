"use client";

import { Badge } from "@/components/ui";

import CopyButton from "@/components/buttons/CopyButton";
import { GET_ORDER_BY_ID_ADMIN } from "@/graphQL";
import { formatLocaleDate, getOrderStatusVariant } from "@/utils";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { OrderByIdDetailsListSection } from "./OrderByIdDetailsListSection";
import { OrderByIdDetailsHeaderSection } from "./OrderByIdDetailsSection";

export default function AdminOrderByIdPage() {
  const { id } = useParams();
  const { data, error, loading } = useQuery(gql(GET_ORDER_BY_ID_ADMIN), {
    variables: { id },
    skip: !id,
  });

  const order = data?.getOrderByIdAdmin;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { date, time } = formatLocaleDate(order?.createdAt as string);

  return (
    <>
      <section>
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex h-6 gap-4">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {order.reference}
            </h1>
            <Badge variant={getOrderStatusVariant(order.status)}>
              {order.status}
            </Badge>
            <CopyButton
              className="size-6"
              toCopy={order.reference ?? ""}
              copiedText="Copié !"
            />
          </div>
          <div className="flex flex-col gap-2 pt-1 leading-none tracking-tight">
            <span className="md:text-end font-bold">Effectué le :</span>
            <span className="text-muted-foreground">
              {date} à {time}
            </span>
          </div>
        </div>

        <h2 className="text-muted-foreground mb-2">
          Nombre de produits: {order.orderItems?.length ?? 0}
        </h2>
      </section>

      <OrderByIdDetailsHeaderSection order={order} />

      <OrderByIdDetailsListSection order={order} />
    </>
  );
}
