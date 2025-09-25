import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DeleteButton from "../buttons/DeleteButton";

interface ProfileCardProps {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  onEdit: () => void;
  onDelete: () => Promise<boolean>;
}

export default function ProfileCard({
  firstname,
  lastname,
  email,
  id,
  onEdit,
  onDelete,
}: ProfileCardProps) {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-2 p-4 sm:p-6 mb-6">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="24" r="24" fill="#E5E7EB" />
          <ellipse cx="24" cy="19" rx="8" ry="8" fill="#A0AEC0" />
          <path
            d="M12 38c0-6.627 7.163-12 16-12s16 5.373 16 12"
            fill="#A0AEC0"
          />
        </svg>
      </div>
      <div className="flex-1 flex flex-col items-center md:items-start gap-2">
        <div className="font-bold">
          {firstname} {lastname}
        </div>
        <div className="text-sm text-gray-500">{email}</div>
      </div>
      <Button className=" md:w-auto md:self-center" onClick={onEdit}>
        Modifier mes infos
      </Button>
      <DeleteButton
        onDeleteFunction={onDelete}
        elementIds={[id]}
        ariaLabel={"deleteActivityAriaLabel"}
        modalTitle="Supprimer votre profil"
        modalDescription="Cette action sera définitive. Voulez-vous vraiment supprimer votre profil ?"
        className="size-10"
      />
    </Card>
  );
}
