import { Cart, User } from "@/gql/graphql";
import { capitalize } from "@/utils/capitalize";
import { Flag } from "lucide-react";

type AdressResumeType = {
  cart: Cart | null;
  className?: string;
  user: User | null;
};

const AdressResume = ({ cart, className, user }: AdressResumeType) => {
  return (
    <div
      className={`border rounded-xs p-4 w-full lg:max-w-[350px] ${className}`}
    >
      <h2>Adresse de facturation</h2>
      <div className="mt-3 flex flex-col gap-1">
        <p>
          {capitalize(user?.firstname)} {capitalize(user?.lastname)}
        </p>
        <p>
          {cart?.address1}
          {cart?.address2 ? " ," + cart.address2 : ""}
        </p>
        <p>
          {capitalize(cart?.city)} {cart?.zipCode}
        </p>
        <p className="flex items-center">
          <Flag className="size-5" /> {cart?.country?.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default AdressResume;
