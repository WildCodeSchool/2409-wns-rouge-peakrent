export function generateOrderReference(
  date?: string,
  reference?: string
): string {
  if (reference && reference.trim().length > 0) {
    return reference;
  }

  const parsedDate = date ? new Date(date) : new Date();
  const dateToUse = parsedDate.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 alphanum chars

  return `ORD-${dateToUse}-${randomPart}`;
}
