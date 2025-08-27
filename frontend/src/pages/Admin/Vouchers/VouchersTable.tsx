import { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { ColumnConfig } from "@/types/datasTable";

import { LIST_VOUCHERS, UPDATE_VOUCHER } from "@/graphQL/vouchers";
import { useVoucherStore } from "@/stores/admin/voucher.store";
import { createColumns } from "./vouchersColumns";

export default function VouchersTable() {
  const vouchers = useVoucherStore((s) => s.vouchers);
  const fetched = useVoucherStore((s) => s.fetched);
  const setVouchers = useVoucherStore((s) => s.setVouchers);
  const setFetched = useVoucherStore((s) => s.setFetched);

  const { data, error, loading, refetch } = useQuery(gql(LIST_VOUCHERS), {
    fetchPolicy: "cache-and-network",
  });
  const [updateVoucher] = useMutation(gql(UPDATE_VOUCHER));

  const columnConfigs: ColumnConfig[] = [
    {
      id: "type",
      title: "Type",
      options: [
        { label: "percentage", value: "percentage" },
        { label: "fixed", value: "fixed" },
      ],
    },
    {
      id: "isActive",
      title: "Actif",
      options: [
        { label: "Actif", value: "true" },
        { label: "Inactif", value: "false" },
      ],
    },
  ];

  useEffect(() => {
    if (error) {
      console.error(error);
      toast.error("Erreur lors de la récupération des vouchers");
      return;
    }
    if (data?.listVouchers) {
      setVouchers(data.listVouchers);
      setFetched(true);
    }
  }, [data, error, setVouchers, setFetched]);

  if (loading || !fetched) {
    return (
      <DataTableSkeleton
        columns={createColumns}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={6}
        cellHeights={72}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  const onDeleteMultipleFunction = async (ids: (string | number)[]) => {
    // soft delete côté UI = rendre inactif
    await Promise.all(
      ids.map(async (id) => {
        try {
          await updateVoucher({
            variables: { id: Number(id), data: { isActive: false } },
          });
        } catch (e: any) {
          console.error(e);
        }
      })
    );
    toast.success("Vouchers désactivés");
    await refetch();
    return true;
  };

  return (
    <Table
      data={vouchers}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "code",
        placeholder: `Rechercher par code / "id"`,
      }}
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
