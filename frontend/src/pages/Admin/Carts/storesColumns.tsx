import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { createHiddenColumnsFunction } from "@/components/ui/tables/columns/utils/createHiddenColumns";
import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { DataTableRowStoresActions } from "./StoreActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const email = row.getValue("email") as string;
  const firstname = row.getValue("firstname") as string;
  const lastname = row.getValue("lastname") as string;
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    email?.toLowerCase().includes(searchText) ||
    firstname?.toLowerCase().includes(searchText) ||
    lastname?.toLowerCase().includes(searchText) ||
    '"' + id?.toLowerCase() + '"' === searchText
  );
};

const hiddenColumns = createHiddenColumnsFunction([
  { id: "firstname", accessorKey: "profile.firstname" },
  { id: "lastname", accessorKey: "profile.lastname" },
  { id: "address2" },
  { id: "complement" },
  { id: "zipcode" },
  { id: "city" },
]);

export const createColumns: ColumnDef<any>[] = [
  column.createSelectColumn(),

  column.createStringColumn({
    id: "id",
    accessorKey: "id",
    title: "#",
    className: "text-start",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createFullNameWithEmailColumn({
    id: "email",
    title: "Email",
    firstnameKey: "profile.firstname",
    lastnameKey: "profile.lastname",
    emailKey: "profile.email",
    enableHiding: true,
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  {
    id: "address",
    accessorKey: "address1",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Adresse"
        className="max-w-[300px] w-[300px]line-clamp-2"
      />
    ),
    cell: ({ row }) => {
      const address = row.original.address1;
      const address2 = row.original.address2;
      const zipcode = row.original.zipcode;
      const city = row.original.city;
      return (
        <div className="flex flex-col items-center justify-center w-[300px] max-w-[300px]">
          <span className="line-clamp-2">{address ?? "---"}</span>
          <span className="text-muted-foreground">{address2 ?? "---"}</span>
          <span className="flex gap-2">
            <span className="">{zipcode ?? "---"}</span>
            <span className="">{city ?? "---"}</span>
          </span>
        </div>
      );
    },
    enableHiding: true,
  },

  column.createStringColumn({
    id: "country",
    accessorKey: "country",
    title: "Pays",
    enableSorting: true,
    enableHiding: true,
  }),

  {
    id: "orderItems",
    accessorKey: "orderItems",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Articles"
        className="max-w-[75px]"
      />
    ),
    cell: ({ row }) => {
      const nbOrderItems = row.original.orderItems?.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );
      return (
        <div className="flex items-center justify-center">{nbOrderItems}</div>
      );
    },
    enableHiding: true,
  },

  column.createDateColumn({
    id: "createdAt",
    accessorKey: "createdAt",
    title: "Crée le",
    enableSorting: true,
    enableHiding: true,
    showTime: true,
  }),

  column.createDateColumn({
    id: "updatedAt",
    accessorKey: "updatedAt",
    title: "Modifié le",
    enableSorting: true,
    enableHiding: true,
    showTime: true,
  }),

  ...hiddenColumns,

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowStoresActions row={row} />,
  },
];
