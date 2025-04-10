import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTableRowStoresActions } from "./StoreActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const name = row.getValue("name") as string;
  const reference = String(row.getValue("reference"));
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    name?.toLowerCase().includes(searchText) ||
    reference?.toLowerCase().includes(searchText) ||
    '"' + id?.toLowerCase() + '"' === searchText
  );
};

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

  column.createHiddenColumn({
    id: "firstname",
    accessorKey: "profile.firstname",
    title: "Prénom",
    enableSorting: true,
  }),

  column.createHiddenColumn({
    id: "lastname",
    accessorKey: "profile.lastname",
    title: "Nom",
    enableSorting: true,
  }),

  column.createStringColumn({
    id: "address",
    accessorKey: "address1",
    title: "Adresse",
    className: "max-w-[200px] line-clamp-2",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "address2",
    accessorKey: "address2",
    title: "complement",
    className: "max-w-[200px] line-clamp-2",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "city",
    accessorKey: "city",
    title: "Ville",
    enableSorting: true,
    enableHiding: true,
  }),

  column.createStringColumn({
    id: "country",
    accessorKey: "country",
    title: "Pays",
    enableSorting: true,
    enableHiding: true,
  }),

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

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowStoresActions row={row} />,
  },
];
