import { Cart, User } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { capitalize } from "@/utils/capitalize";
import { CreditCard, Flag, MapPin, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type AdressResumeType = {
  cart?: Cart | null;
  className?: string;
  user: User | null;
  paymentMethod?: string;
};

const AdressResume = ({
  cart,
  className,
  user,
  paymentMethod,
}: AdressResumeType) => {
  return (
    <Card className={cn("shadow-sm border-slate-200/60", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <MapPin className="size-5 text-green-600" />
          Adresse de facturation
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <UserIcon className="size-4 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-slate-600 text-base">
              {capitalize(user?.firstname)} {capitalize(user?.lastname)}
            </p>
          </div>
        </div>
        <div className="pl-7 space-y-2">
          <div className="text-slate-600">
            <p className="leading-relaxed">
              {cart?.address1}
              {cart?.address2 && (
                <span className="block text-slate-600">{cart.address2}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>{cart?.zipCode}</span>
            <span className="font-medium">{capitalize(cart?.city)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Flag className="size-4 text-slate-500" />
            <span className="font-medium tracking-wide">
              {cart?.country?.toUpperCase()}
            </span>
          </div>
        </div>
        {paymentMethod && (
          <div className="border-t border-slate-100 pt-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard className="size-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 text-base">
                  Méthode de paiement
                </h4>
                <div className="flex items-center gap-2">
                  <p className="text-slate-600 capitalize">
                    {paymentMethod === "card"
                      ? "Carte bancaire"
                      : capitalize(paymentMethod)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdressResume;
