import { createHiddenColumn } from "../hidden.column";

interface HiddenColumnProps {
  id: string;
  accessorKey?: string;
  title?: string;
}

export function createHiddenColumnsFunction(columns: HiddenColumnProps[]) {
  return columns.map(({ id, accessorKey, title }) =>
    createHiddenColumn({
      id,
      accessorKey: accessorKey ?? id,
      title: title ?? id,
    })
  );
}