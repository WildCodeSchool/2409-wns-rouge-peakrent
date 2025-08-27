"use client";

import CopyButton from "@/components/buttons/CopyButton";
import { GET_ORDER_BY_REF_ADMIN } from "@/graphQL";
import { formatLocaleDate } from "@/utils";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { OrderByIdDetailsListSection } from "./OrderByIdDetailsListSection";
import { OrderByIdDetailsHeaderSection } from "./OrderByIdDetailsSection";

export default function AdminOrderByRefPage() {
  const { ref } = useParams();
  const { data, error, loading } = useQuery(gql(GET_ORDER_BY_REF_ADMIN), {
    variables: { ref },
    skip: !ref,
  });

  const order = data?.getOrderByRefAdmin;

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
