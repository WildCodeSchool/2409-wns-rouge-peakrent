export const cleanFileName = (fileName: string) => {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
};
