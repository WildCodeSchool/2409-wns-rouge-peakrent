import * as column from "@/components/ui/tables/columns";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { getColorForRole } from "@/utils/getVariants/getRoleVariant";
import { DataTableRowUsersActions } from "./UserActions";

const multiColumnFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const firstName = row.getValue("firstname") as string;
  const lastName = row.getValue("lastname") as string;
  const email = String(row.getValue("email"));
  const id = String(row.getValue("id"));
  const searchText = filterValue.toLowerCase();

  return (
    firstName?.toLowerCase().includes(searchText) ||
    lastName?.toLowerCase().includes(searchText) ||
    email?.toLowerCase().includes(searchText) ||
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
    firstnameKey: "firstname",
    lastnameKey: "lastname",
    emailKey: "email",
    enableHiding: true,
    enableSorting: true,
    filterFn: multiColumnFilter,
  }),

  column.createHiddenColumn({
    id: "firstname",
    accessorKey: "firstname",
    title: "Prénom",
    enableSorting: true,
  }),

  column.createHiddenColumn({
    id: "lastname",
    accessorKey: "lastname",
    title: "Nom",
    enableSorting: true,
  }),

  column.createBadgeColumn({
    id: "role",
    accessorKey: "role",
    title: "Rôle",
    className: "w-[120px]",
    variantFn: (row) => getColorForRole(row.original.role),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    cell: ({ row }) => <DataTableRowUsersActions row={row} />,
  },
];
