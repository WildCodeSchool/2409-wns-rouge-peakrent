import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import "reflect-metadata";
import sharp from "sharp";
import { dataSource } from "./config/db";
import { getUserFromContext } from "./helpers/helpers";
import { getSchema } from "./schema";
import { ContextType } from "./types";

const GRAPHQL_PORT = 4000;
const UPLOAD_PORT = 4001;
const UPLOADS_DIR = path.join(__dirname, "../uploads");

const initialize = async () => {
  await dataSource.initialize();
  const schema = await getSchema();
  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: GRAPHQL_PORT },
    context: async ({ req, res }) => {
      const context: ContextType = {
        req,
        res,
        user: undefined,
      };
      const user = await getUserFromContext(context);
      context.user = user;
      return context;
    },
  });
  console.log(`Server ready at: ${url} 🚀`);

  const app = express();
  app.use(cors());
  app.use(express.json());

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

        const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
        res.json({ url });
      } catch (error) {
        console.error("Sharp error:", error);
        res.status(500).send("Image processing failed");
      }
    }
  );

  app.use("/uploads", express.static(UPLOADS_DIR));
  app.listen(UPLOAD_PORT, () => {
    console.log(
      `📤 Upload server ready at http://localhost:${UPLOAD_PORT}/upload`
    );
  });
};

initialize();
