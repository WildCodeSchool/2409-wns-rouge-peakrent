import { DataTableColumnHeader } from "@/components/ui/tools/dataTableColumnHeader";
import { cn } from "@/lib/utils";
import newLogo from "@/public/logo-new.webp";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

import { ImageHandler } from "./components/ImageHandler";
import { getNestedValueFunction } from "./utils/getNestedValue";

interface CustomColumnProps {
  id: string;
  title: string;
  accessorKey: string;
  altAccessorKey: string;
  accessorForTag: string;
  tagImage: "new" | "update";
  enableSorting?: boolean;
  enableHiding?: boolean;
  renderCell?: (data: any) => ReactNode;
  size?: number;
  headerClassName?: string;
}

/**
 * Creates an image column for a table.
 *
 * @param {Object} params - The parameters to configure the image column.
 * @param {string} params.id - Unique identifier for the column.
 * @param {string} params.title - Title to display in the column header.
 * @param {string} params.accessorKey - Accessor key to retrieve the image URL.
 * @param {string} params.altAccessorKey - Accessor key to retrieve the alt text for the image.
 * @param {string} [params.accessorForTag] - Accessor key to retrieve the tag image.
 * @param {("new" | "update")} [params.tagImage="new"] - Type of tag image to display.
 * @param {boolean} [params.enableSorting=false] - Indicates if the column can be sorted.
 * @param {boolean} [params.enableHiding=false] - Indicates if the column can be hidden.
 * @param {function} [params.renderCell] - Custom render function for the cell. If not provided, defaults to rendering an image.
 * @param {number} [params.size=50] - Size of the image in pixels.
 * @param {string} [params.headerClassName] - Additional CSS classes for the header.
 *
 * @returns {ColumnDef<any>} Column definition object for Tanstack Table.
 *
 * @example
 * const imageColumn = createImageColumn({
 *   id: "Image",
 *   title: "Image",
 *   accessorKey: "imageUrl",
 *   altAccessorKey: "imageAlt",
 * });
 */
export function createImageWithTagColumn({
  id,
  title,
  accessorKey,
  altAccessorKey,
  accessorForTag,
  tagImage = "new",
  enableSorting = false,
  enableHiding = false,
  renderCell,
  size = 50,
  headerClassName,
}: CustomColumnProps): ColumnDef<any> {
  return {
    id,
    accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={title}
        className={cn("max-w-[50px]", headerClassName)}
      />
    ),
    cell: ({ row }) => {
      const datas = row.original;

      const imageUrl = getNestedValueFunction(datas, accessorKey);
      const altText = getNestedValueFunction(datas, altAccessorKey);
      const valueToTest = getNestedValueFunction(datas, accessorForTag);
      const displayTag = valueToTest ? false : true;
      const logo = tagImage === "new" ? newLogo : "updateLogo";

      return renderCell ? (
        renderCell(datas)
      ) : (
        <div className="relative w-fit">
          {displayTag && (
            <img
              src={logo}
              alt={`logo ${tagImage}`}
              width={40}
              height={40}
              className="absolute -right-4 -top-4 size-10"
            />
          )}
          <ImageHandler
            src={imageUrl}
            alt={altText}
            width={size}
            height={size}
            className={`border-foreground rounded-lg border`}
          />
        </div>
      );
    },
    enableSorting,
    enableHiding,
  };
}
