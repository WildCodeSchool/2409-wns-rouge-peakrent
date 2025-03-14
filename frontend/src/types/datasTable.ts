import { buttonVariants } from "@/components/ui/button";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ColumnDef, Table, VisibilityState } from "@tanstack/react-table";
import { VariantProps } from "class-variance-authority";

export interface ColumnConfig {
  id: string;
  title: string;
  Icon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  options: Array<{
    value: string;
    label: string | React.ReactNode;
    icon?: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >;
  }>;
}

export interface SelectFunction {
  icon: React.ReactNode;
  text: string;
  onTrigger: (selectedRows: any[]) => Promise<boolean> | boolean;
  condition?: (selectedRows: any[]) => boolean;
  isPending?: boolean;
  className?: string; 
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export type RowLink = {
  rowLink: string;
  customPath: string;
};

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterTextOptions?: { id: string; placeholder: string };
  columnConfigs?: ColumnConfig[];
  rowLink?: string | RowLink | ((row: any) => any) | undefined;
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  hideColumns?: VisibilityState;
  multipleSelectFunctions?: SelectFunction[];
  hideExport?: boolean;
  devEditOneRowFunction?: (row: any) => void;
  devEditAllRowsFunction?: (rows: any[]) => void;
  CardComponent?: React.ComponentType<any>;
  viewMode?: "table" | "card";
  setViewMode?: React.Dispatch<React.SetStateAction<"table" | "card">>;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterTextOptions?: { id: string; placeholder: string };
  columnConfigs?: ColumnConfig[];
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  multipleSelectFunctions?: SelectFunction[];
  hideExport?: boolean;
  showViewMode?: boolean;
  viewMode?: "table" | "card";
  setViewMode?: React.Dispatch<React.SetStateAction<"table" | "card">>;
}

export interface DataTableToolbarActionsProps {
  table: Table<any>;
  onDeleteMultipleFunction?: (ids: string[] | number[]) => Promise<boolean>;
  multipleSelectFunctions?: SelectFunction[];
  hideExport?: boolean;
}
