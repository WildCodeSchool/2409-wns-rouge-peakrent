export const createGetMessage = (t?: MessagesIntl) => {
  return (key: string, variables?: Record<string, any>) => {
    if (t) {
      return variables ? t(key, variables) : t(key);
    }
    return key;
  };
};
