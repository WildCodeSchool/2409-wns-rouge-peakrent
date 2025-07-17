import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface TokenValidationCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
}

export function TokenValidationCard({
  title,
  description,
  buttonText,
  buttonLink,
  icon = <CheckCircle className="w-10 h-10 text-green-600" />,
}: TokenValidationCardProps) {
  return (
    <Card className="max-w-md mx-auto mt-8 py-4">
      <CardContent className="p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          {icon}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <Link to={buttonLink}>
          <Button className="w-full" size="lg" variant="primary">
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
