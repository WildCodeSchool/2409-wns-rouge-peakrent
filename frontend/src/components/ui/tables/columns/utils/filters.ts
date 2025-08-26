import { Row } from "@tanstack/react-table";

export function genericBooleanNullFilter<T>() {
  return (row: Row<T>, id: string, value: (boolean | null)[]): boolean => {
    const rowValue = row.getValue(id);

    if (value.includes(null)) {
      return rowValue === null || rowValue === undefined;
    }

    if (value.includes(true)) {
      return !!rowValue;
    }

    if (value.includes(false)) {
      return !rowValue;
    }

    return true;
  };
}

export function genericStringFilter<T>() {
  return (row: Row<T>, id: string, value: string[]): boolean => {
    const rowValue = row.getValue(id);
    return value.includes(rowValue as string);
  };
}
