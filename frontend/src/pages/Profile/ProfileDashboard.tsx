import ProfileCard from "@/components/cards/ProfileCard";
import { Button } from "@/components/ui/button";
import * as column from "@/components/ui/tables/columns";
import { DataTableSkeleton } from "@/components/ui/tables/DataTableSkeleton";
import Table from "@/components/ui/tables/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/userProvider";
import { Order, OrderItem } from "@/gql/graphql";
import { DELETE_PROFILE } from "@/graphQL";
import { GET_MY_ORDERS } from "@/graphQL/order";
import { SIGNOUT } from "@/graphQL/signout";
import { WHOAMI } from "@/graphQL/whoami";
import { getDurationInDays } from "@/utils/getDurationInDays";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LogOut, ShieldUser } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// En attendant de mettre en place la traduction
const translateStatus = (status: string) => {
  const statusTranslations = {
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };
  return (
    statusTranslations[status as keyof typeof statusTranslations] || status
  );
};

const columns = [
  column.createStringColumn({
    id: "reference",
    accessorKey: "reference",
    title: "Référence",
    enableSorting: true,
  }),
  column.createPriceColumn({
    id: "prix",
    accessorKey: "prix",
    title: "Prix",
    enableSorting: true,
    devise: "€",
    priceFn: (row) =>
      (
        row.original.orderItems?.reduce(
          (acc: number, item: OrderItem) =>
            acc +
            (item.pricePerHour *
              item.quantity *
              getDurationInDays(item.startsAt, item.endsAt)) /
              100,
          0
        ) || 0
      ).toFixed(2),
  }),
  column.createDateColumn({
    id: "debut",
    accessorKey: "startsAt",
    title: "Début",
    enableSorting: true,
  }),
  column.createDateColumn({
    id: "fin",
    accessorKey: "endsAt",
    title: "Fin",
    enableSorting: true,
  }),
  column.createStringColumn({
    id: "statut",
    accessorKey: "status",
    title: "Statut",
    enableSorting: true,
    labelFn: (status: string) => translateStatus(status),
  }),
];

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("en-cours");

  const { user, profile, loading } = useUser();

  const [doSignout] = useMutation(gql(SIGNOUT), {
    onCompleted: () => {
      window.location.reload();
    },
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  const [deleteProfile] = useMutation(gql(DELETE_PROFILE), {
    onCompleted: () => {
      window.location.reload();
    },
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  const { data: ordersData, loading: loadingOrders } = useQuery(
    gql(GET_MY_ORDERS)
  );

  if (loading || loadingOrders) {
    return <div>Chargement…</div>;
  }

  const handleEdit = () => navigate("/profile/edit");

  const handleDelete = async () => {
    try {
      await deleteProfile();
      toast.success("Profil supprimé avec succès.");
      navigate("/");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("La suppression du profil a échoué.");
      return false;
    }
  };

  const handleSignout = async () => {
    await doSignout();
    navigate("/");
  };

  const getFilteredOrders = (tabValue: string) => {
    const orders = ordersData?.getMyOrders as (Order & {
      orderItems: OrderItem[];
    })[];
    const formattedOrders = [] as (Order & {
      startsAt: Date;
      endsAt: Date;
    })[];

    orders.forEach((order) => {
      const dates = order.orderItems.map((item: OrderItem) => ({
        start: new Date(item.startsAt),
        end: new Date(item.endsAt),
      }));

      const startsAt = new Date(
        Math.min(
          ...dates.map((d: { start: Date; end: Date }) => d.start.getTime())
        )
      );
      const endsAt = new Date(
        Math.max(
          ...dates.map((d: { start: Date; end: Date }) => d.end.getTime())
        )
      );

      formattedOrders.push({
        ...order,
        startsAt,
        endsAt,
      });
    });

    switch (tabValue) {
      case "en-cours":
        return formattedOrders.filter((order: Order) =>
          ["pending", "confirmed"].includes(order.status)
        );
      case "passees":
        return formattedOrders.filter((order: Order) =>
          ["completed", "cancelled", "refunded"].includes(order.status)
        );
      default:
        return formattedOrders;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-2">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <div className="flex flex-row gap-2 md:hidden">
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Button
              variant="primary"
              onClick={() => navigate("/admin")}
              aria-label="Accéder au panel admin"
            >
              <ShieldUser size={25} className="flex-none" />
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleSignout}
            aria-label="Se déconnecter"
          >
            Déconnexion
            <LogOut size={20} className="flex-none ml-2" />
          </Button>
        </div>
      </div>
      <ProfileCard
        firstname={profile?.firstname || ""}
        lastname={profile?.lastname || ""}
        email={profile?.email || ""}
        id={profile?.id || ""}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
      <div className="mb-4 items-center">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="w-full items-center"
        >
          <TabsList className="mb-4 flex justify-center gap-2 overflow-x-auto whitespace-nowrap text-sm sm:text-base">
            <TabsTrigger value="en-cours" className="min-w-[100px]">
              En cours ({getFilteredOrders("en-cours").length})
            </TabsTrigger>
            <TabsTrigger value="passees" className="min-w-[100px]">
              Passées ({getFilteredOrders("passees").length})
            </TabsTrigger>
            <TabsTrigger value="favoris" className="min-w-[100px]">
              Favoris
            </TabsTrigger>
          </TabsList>

          <TabsContent className="w-full" value="en-cours">
            {loadingOrders ? (
              <DataTableSkeleton
                columns={columns}
                rowCount={3}
                cellHeights={60}
                cellWidths={["auto"]}
                shrinkZero
              />
            ) : (
              <Table
                data={getFilteredOrders("en-cours")}
                columns={columns}
                hideExport
                hideViewOptions={true}
                viewMode="table"
                rowLink={{ customPath: "/profile/order", rowLink: "id" }}
              />
            )}
          </TabsContent>

          <TabsContent className="w-full" value="passees">
            {loadingOrders ? (
              <DataTableSkeleton
                columns={columns}
                rowCount={3}
                cellHeights={60}
                cellWidths={["auto"]}
                shrinkZero
              />
            ) : (
              <Table
                data={getFilteredOrders("passees")}
                columns={columns}
                hideExport
                hideViewOptions={true}
                viewMode="table"
                rowLink={{ customPath: "/profile/order", rowLink: "id" }}
              />
            )}
          </TabsContent>

          <TabsContent className="w-full" value="favoris">
            {/* TODO: Implémenter l'affichage des produits favoris de l'utilisateur */}
            <div className="w-full flex justify-center items-center py-8">
              <p className="text-center text-gray-500">
                Aucun favoris pour le moment
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
