import { DataTableProps } from "@/types/datasTable";

import { DataTable } from "./DataTable";

const Table = <TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  onDeleteMultipleFunction,
  hideColumns,
  multipleSelectFunctions,
  hideExport,
  devEditAllRowsFunction,
  devEditOneRowFunction,
  CardComponent,
  viewMode,
  setViewMode,
}: DataTableProps<TData, TValue>) => {
  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        filterTextOptions={filterTextOptions}
        columnConfigs={columnConfigs}
        rowLink={rowLink}
        onDeleteMultipleFunction={onDeleteMultipleFunction}
        hideColumns={hideColumns}
        multipleSelectFunctions={multipleSelectFunctions}
        hideExport={hideExport}
        devEditAllRowsFunction={devEditAllRowsFunction}
        devEditOneRowFunction={devEditOneRowFunction}
        CardComponent={CardComponent}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </>
  );
};

export default Table;
