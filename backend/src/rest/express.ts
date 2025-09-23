import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  if (req.originalUrl === "/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).send("No file uploaded.");

      const originalName = req.file.originalname
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.-]/g, "");

      const baseName =
        originalName.substring(0, originalName.lastIndexOf(".")) || "image";
      const filename = `${baseName}-${Date.now()}.webp`;
      const outputPath = path.join(UPLOADS_DIR, filename);

      await sharp(req.file.buffer)
        .resize({ width: 1080 })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const url = `${req.protocol}://${process.env.NGINX_URL}/rest/uploads/${filename}`;
      res.json({ url });
    } catch (error) {
      console.error("Sharp error:", error);
      res.status(500).send("Image processing failed");
    }
  }
);

app.use("/uploads", express.static(UPLOADS_DIR));

export default app;
