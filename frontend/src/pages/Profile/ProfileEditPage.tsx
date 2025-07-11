import EditProfile from "@/components/forms/ProfileEditForm";
import { useUser } from "@/context/userProvider";
import { UPDATE_USER_PROFILE } from "@/graphQL/profiles";
import { WHOAMI } from "@/graphQL/whoami";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const { profile, loading } = useUser();

  const [updateProfile, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(gql(UPDATE_USER_PROFILE), {
      refetchQueries: [{ query: gql(WHOAMI) }],
      awaitRefetchQueries: true,
    });

  if (loading) {
    return <div>Chargement…</div>;
  }
  if (!profile) {
    return <div>Profil introuvable.</div>;
  }

  const handleSave = async (data: {
    firstname: string;
    lastname: string;
    email: string;
  }) => {
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
      console.error(e);
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
      {errorUpdate && (
        <div className="text-red-500 mt-2">Erreur lors de la sauvegarde.</div>
      )}
    </div>
  );
}
