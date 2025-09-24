export function translateStatus(status: string): string {
  const statusTranslations = {
    pending: "En attente de paiement",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
    refunded: "Remboursée",
    inProgress: "En cours de location",
  };
  return (
    statusTranslations[status as keyof typeof statusTranslations] || status
  );
}
