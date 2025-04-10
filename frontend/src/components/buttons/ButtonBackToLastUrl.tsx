import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function ButtonBackToLastUrl() {
  const navigate = useNavigate();
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-7"
      type="button"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft className="size-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
