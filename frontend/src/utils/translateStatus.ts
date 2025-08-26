export function translateStatus(status: string): string {
  const statusTranslations = {
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };
  return (
    statusTranslations[status as keyof typeof statusTranslations] || status
  );
}
