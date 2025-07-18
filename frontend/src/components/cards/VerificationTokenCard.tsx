import { LoadIcon } from "@/components/icons/LoadIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function VerificationTokenCard() {
  return (
    <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
      <CardHeader>
        <CardTitle className="text-2xl">Vérification du token...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <LoadIcon size={24} />
        </div>
      </CardContent>
    </Card>
  );
}
