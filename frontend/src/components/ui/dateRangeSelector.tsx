export function DateRangeSelector({
  selectedStartingDate,
  setSelectedStartingDate,
  selectedEndingDate,
  setSelectedEndingDate,
  className,
}: {
  selectedStartingDate: string | undefined;
  setSelectedStartingDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedEndingDate: string | undefined;
  setSelectedEndingDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  className?: string | undefined;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row flex-wrap mb-5 gap-2 ${className}`}
    >
      <div>
        <label htmlFor="starting-date" className="flex flex-wrap gap-1">
          Du:
        </label>
        <input
          type="date"
          value={selectedStartingDate}
          onChange={(e) => setSelectedStartingDate(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Date de début"
          id="starting-date"
        />
      </div>

      <div>
        <label htmlFor="ending-date" className="flex flex-wrap gap-1">
          Au:
        </label>
        <input
          type="date"
          value={selectedEndingDate}
          onChange={(e) => setSelectedEndingDate(e.target.value)}
          className="border rounded px-2 py-1"
          aria-label="Date de fin"
          id="ending-date"
        />
      </div>
    </div>
  );
}
