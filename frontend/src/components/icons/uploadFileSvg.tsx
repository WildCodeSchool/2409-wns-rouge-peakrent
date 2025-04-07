type FileSvgDrawProps = {
  clickText: string;
  dragText: string;
  extensionsText: string;
};

export const FileSvgDraw = ({
  clickText,
  dragText,
  extensionsText,
}: FileSvgDrawProps) => {
  return (
    <>
      <svg
        className="mb-3 size-8 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="block font-semibold">{clickText}</span>
        <span className="block text-center">{dragText}</span>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {extensionsText}
      </p>
    </>
  );
};
