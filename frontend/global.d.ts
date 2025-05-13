declare global {
  interface MessagesIntl {
    (key: string, variables?: Record<string, any>);
  }
}

export {};
