import fs from "fs";
import path from "path";
import { URL } from "url";

export function deleteImageFromUploadsDir(url: string) {
  try {
    const parsedUrl = new URL(url);
    const filePath = parsedUrl.pathname.replace(/^\/uploads\//, "");
    const fullPath = path.join(process.cwd(), "uploads", filePath);

    if (!fs.existsSync(fullPath)) {
      console.warn("Fichier introuvable :", fullPath);
      return;
    }

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image:", err);
      } else {
        console.log("Image supprimée:", fullPath);
      }
    });
  } catch (error) {
    console.error("URL invalide ou erreur interne :", error);
  }
}
