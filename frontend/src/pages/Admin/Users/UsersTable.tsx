import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { GET_PROFILES } from "@/GraphQL/profiles";
import { useUserStore } from "@/stores/admin/user.store";
import { ColumnConfig } from "@/types/datasTable";
import { getRoleOptionsLabels } from "@/utils/getRoleVariant";
import { useQuery } from "@apollo/client";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ShieldUser } from "lucide-react";
import { toast } from "sonner";
import { createColumns } from "./usersColumns";

export default function UsersTable() {
  const usersStore = useUserStore((state) => state.users);
  const usersFetched = useUserStore((state) => state.usersFetched);
  const setUsers = useUserStore((state) => state.setUsers);
  const setUsersFetched = useUserStore((state) => state.setUsersFetched);

  const { data, error, loading } = useQuery(GET_PROFILES);

  const columnConfigs: ColumnConfig[] = [
    {
      id: "role",
      title: "Rôle",
      options: getRoleOptionsLabels(),
      Icon: ShieldUser as unknown as React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >,
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors de la récupération des utilisateurs");
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return;
    }

    if (data?.getProfiles) {
      setUsers(data.getProfiles);
      setUsersFetched(true);
    }
  }, [data, error, setUsers, setUsersFetched]);

  if (loading || !usersFetched) {
    return (
      <DataTableSkeleton
        columns={createColumns}
        searchableColumnCount={1}
        filterableColumnCount={2}
        rowCount={6}
        cellHeights={85}
        cellWidths={["auto"]}
        shrinkZero
      />
    );
  }

  const onDeleteMultipleFunction = async (ids: string[] | number[]) => {
    return true;
  };

  return (
    <Table
      data={usersStore}
      columns={createColumns}
      columnConfigs={columnConfigs}
      filterTextOptions={{
        id: "email",
        placeholder: `Email / Prénom / Nom / "id"`,
      }}
      hideColumns={{ firstname: false, lastname: false }}
      rowLink="id"
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
