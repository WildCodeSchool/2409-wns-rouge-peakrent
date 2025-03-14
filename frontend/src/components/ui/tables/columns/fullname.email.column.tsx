import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import { ColumnDef, FilterFn } from "@tanstack/react-table";

import CopyButton from "@/components/buttons/CopyButton";
import { getNestedValueFunction } from "./utils/getNestedValue";

interface NameColumnProps {
  id: string;
  title: string;
  emailKey: string;
  lastnameKey: string;
  firstnameKey: string;
  enableHiding?: boolean;
  enableSorting?: boolean;
  filterFn?: FilterFn<any>;
  headerClassName?: string;
  cellClassName?: string;
  emailClassName?: string;
  fullnameClassName?: string;
}

/**
 * Creates a name column for a table with SKU and status badge.
 *
 * @param {Object} params - The parameters to configure the name column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.firstnameKey - Accessor key to retrieve the firstname.
 * @param {string} params.lastnameKey - Accessor key to retrieve the lastname.
 * @param {string} params.emailKey - Accessor key to retrieve the email.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {FilterFn<any>} [params.filterFn] - Custom filter function for the column.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 * @param {string} [params.cellClassName] - Additional CSS classes for the cell.
 * @param {string} [params.emailClassName] - Additional CSS classes for the email.
 * @param {string} [params.fullnameClassName] - Additional CSS classes for the fullname.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const nameColumn = createNameWithSkuAndStatusColumn({
 *   id: "name",
 *   title: "Name / SKU",
 *   accessorKey: "variant.reference.name",
 *   skuKey: "variant.reference.sku",
 *   statusKey: "status",
 * });
 */
export function createFullNameWithEmailColumn({
  id,
  title,
  firstnameKey,
  lastnameKey,
  emailKey,
  enableHiding = false,
  enableSorting = false,
  filterFn,
  headerClassName,
  cellClassName,
  emailClassName,
  fullnameClassName,
}: NameColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey: emailKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn(
          "max-w-[120px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[350px]",
          headerClassName
        )}
      />
    ),
    cell: ({ row }) => {
      const datas: any = row.original;
      const firstname = getNestedValueFunction(datas, firstnameKey);
      const lastname = getNestedValueFunction(datas, lastnameKey);
      const email = getNestedValueFunction(datas, emailKey);

      return (
        <div
          className={cn(
            "flex max-w-[120px] flex-col md:max-w-[200px] lg:max-w-[250px] xl:max-w-[350px]",
            cellClassName
          )}
        >
          <span
            className={cn("truncate font-bold", fullnameClassName)}
            title={firstname + " " + lastname}
          >
            {firstname + " " + lastname}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn("text-muted-foreground truncate", emailClassName)}
              title={email}
            >
              {email}
            </span>
            <CopyButton toCopy={email} />
          </div>
        </div>
      );
    },
    enableHiding,
    enableSorting,
    filterFn,
  };
}
