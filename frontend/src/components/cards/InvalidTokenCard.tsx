import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Link } from "react-router-dom";

export function InvalidTokenCard({
  title,
  description,
  link,
  linkText,
}: {
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <Card className="max-w-md mx-auto mt-8 py-4 gap-4">
      <CardHeader>
        <CardTitle className="text-2xl text-destructive">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Link to={link} className="text-primary underline">
          {linkText}
        </Link>
      </CardFooter>
    </Card>
  );
}
