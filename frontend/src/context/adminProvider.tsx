import { createContext, ReactNode, useContext, useState } from "react";

interface ItemNumbersInterface {
  [key: string]: number;
}

interface AdminContextInterface {
  itemNumbers: ItemNumbersInterface;
}

const AdminContext = createContext<AdminContextInterface | undefined>(
  undefined
);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [itemNumbers, setItemNumbers] = useState<ItemNumbersInterface>({
    "/admin/orders": 4,
  });

  return (
    <AdminContext.Provider value={{ itemNumbers }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
