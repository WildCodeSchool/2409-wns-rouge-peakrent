export const getNestedValueFunction = (obj: any, keyPath: string) => {
  return keyPath.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
};
