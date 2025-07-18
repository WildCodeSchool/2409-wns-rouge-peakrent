import EditProfile from "@/components/forms/ProfileEditForm";

export default function ProfileEditPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-2">
      <h1 className="text-2xl font-bold mb-4 sm:mb-6">Modifier mon profil</h1>
      <EditProfile />
    </div>
  );
}
