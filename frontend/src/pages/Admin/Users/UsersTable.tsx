import { useEffect } from "react";

import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import {
  DELETE_PROFILE_BY_ADMIN,
  GET_PROFILES_ADMIN,
} from "@/graphQL/profiles";
import { useUserStore } from "@/stores/admin/user.store";
import { ColumnConfig } from "@/types/datasTable";
import { getRoleOptionsLabels } from "@/utils/getVariants/getRoleVariant";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { ShieldUser } from "lucide-react";
import { toast } from "sonner";
import { createColumns } from "./usersColumns";
import { Profile } from "@/gql/graphql";

export default function UsersTable() {
  const usersStore = useUserStore((state) => state.users);
  const usersFetched = useUserStore((state) => state.usersFetched);
  const setUsers = useUserStore((state) => state.setUsers);
  const setUsersFetched = useUserStore((state) => state.setUsersFetched);

  const { data, error, loading } = useQuery(gql(GET_PROFILES_ADMIN));
  const [deleteProfile] = useMutation(gql(DELETE_PROFILE_BY_ADMIN), {
    refetchQueries: [{ query: gql(GET_PROFILES_ADMIN) }],
  });

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

    if (data?.getProfilesByAdmin) {
      setUsers(data.getProfilesByAdmin);
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

  const handleDelete = async (userId: string | number) => {
    try {
      await deleteProfile({ variables: { userId: Number(userId) } });
      setUsers(usersStore.filter((u) => u.id !== userId));
      toast.success("Utilisateur supprimé avec succès.");
      return true;
    } catch (error: any) {
      console.error("Erreur suppression:", error.message, error.graphQLErrors);
      toast.error(`Échec suppression : ${error.message}`);
      return false;
    }
  };

  const onDeleteMultipleFunction = async (ids: string[] | number[]) => {
    await Promise.all(ids.map((id) => handleDelete(id)));
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
      hideExport
      onDeleteMultipleFunction={onDeleteMultipleFunction}
    />
  );
}
