import { gql, useQuery, useMutation } from "@apollo/client";
import { WHOAMI } from "@/GraphQL/whoami";
import { GET_MY_PROFILE } from "@/GraphQL/profiles";
import { useNavigate } from "react-router-dom";
import ProfileCard from "@/components/cards/ProfileCard";
import { SIGNOUT } from "@/GraphQL/signout";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldUser } from "lucide-react";

export default function ProfileDashboard() {
  const navigate = useNavigate();

  // 1. Récupérer l'utilisateur connecté
  const { data: userData, loading: loadingUser } = useQuery(gql(WHOAMI));
  const user = userData?.whoami;

  // 2. Récupérer le profil lié à cet utilisateur (si besoin)
  const { data: profileData, loading: loadingProfile } = useQuery(gql(GET_MY_PROFILE));
  const profile = profileData?.getMyProfile;

  const [doSignout] = useMutation(gql(SIGNOUT), {
    refetchQueries: [{ query: gql(WHOAMI) }],
  });

  if (loadingUser || loadingProfile) {
    return <div>Chargement…</div>;
  }

  const handleEdit = () => navigate("/profile/edit");

  const handleSignout = async () => {
    await doSignout();
    navigate("/");
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
        onEdit={handleEdit}
      />
    </div>
  );
}
