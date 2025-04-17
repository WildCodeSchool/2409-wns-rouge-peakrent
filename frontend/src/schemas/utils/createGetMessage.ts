export const createGetMessage = (t?: any) => {
  return (key: string, variables?: Record<string, any>) => {
    if (t) {
      return variables ? t(key, variables) : t(key);
    }
    return key;
  };
};
