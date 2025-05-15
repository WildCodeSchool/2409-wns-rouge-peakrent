export const totalDays = (startsAt: string, endsAt: string): number => {
  const date = Math.floor(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return date > 0 ? date : 1;
};
