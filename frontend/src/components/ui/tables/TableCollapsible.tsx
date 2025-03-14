import { DataTableProps } from "@/types/datasTable";

import { DataTableCollapsible } from "./DataTableCollapsible";

const TableCollapsible = <TData, TValue>({
  columns,
  data,
  filterTextOptions,
  columnConfigs,
  rowLink,
  onDeleteMultipleFunction,
  multipleSelectFunctions,
  renderCollapsibleContent,
  hideColumns,
  hideExport,
  devEditAllRowsFunction,
  devEditOneRowFunction,
  CardComponent,
  viewMode,
  setViewMode,
}: DataTableProps<TData, TValue> & {
  renderCollapsibleContent: (row: any) => React.ReactNode;
}) => {
  return (
    <>
      <DataTableCollapsible
        data={data}
        columns={columns}
        filterTextOptions={filterTextOptions}
        columnConfigs={columnConfigs}
        rowLink={rowLink}
        renderCollapsibleContent={renderCollapsibleContent}
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

export default TableCollapsible;
