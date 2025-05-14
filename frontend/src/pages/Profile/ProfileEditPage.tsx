import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { WHOAMI } from "@/GraphQL/whoami";
import { GET_PROFILE_BY_USER_ID, UPDATE_USER_PROFILE } from "@/GraphQL/profiles";
import EditProfile from "@/components/forms/ProfileEditForm";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté
  const { data: userData, loading: loadingUser } = useQuery(gql(WHOAMI));
  const user = userData?.whoami;

  // Récupérer le profil lié à cet utilisateur
  const { data: profileData, loading: loadingProfile } = useQuery(gql(GET_PROFILE_BY_USER_ID), {
    variables: { userId: user?.id },
    skip: !user?.id,
  });
  const profile = profileData?.getProfileByUserId;

  // Mutation pour mettre à jour le profil
  const [updateProfile, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    gql(UPDATE_USER_PROFILE),
    {
      refetchQueries: [
        { query: gql(GET_PROFILE_BY_USER_ID), variables: { userId: user?.id } }
      ],
      awaitRefetchQueries: true,
    }
  );

  if (loadingUser || loadingProfile) {
    return <div>Chargement…</div>;
  }
  if (!profile) {
    return <div>Profil introuvable.</div>;
  }

  const handleSave = async (data: { firstname: string; lastname: string; email: string }) => {
    try {
      await updateProfile({
        variables: {
          data: {
            firstname: data.firstname,
            lastname: data.lastname,
          },
        },
      });
      navigate("/profile");
    } catch (e) {
      // Erreur déjà gérée par errorUpdate
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-2">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6">Modifier mon profil</h1>
      <EditProfile
        firstname={profile.firstname || ""}
        lastname={profile.lastname || ""}
        email={profile.email || ""}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {loadingUpdate && <div>Enregistrement…</div>}
      {errorUpdate && <div className="text-red-500 mt-2">Erreur lors de la sauvegarde.</div>}
    </div>
  );
}