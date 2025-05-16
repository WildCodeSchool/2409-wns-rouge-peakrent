import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import cors from "cors";
import express, { Request, Response } from "express";
import multer from "multer";
import "reflect-metadata";
import { dataSource } from "./config/db";
import { getUserFromContext } from "./helpers/helpers";
import { getSchema } from "./schema";
import { ContextType } from "./types";
import path from "path";
export interface MulterRequest extends Request {
  file: tempType;
}
export interface tempType extends File {
  filename: string;
}

const GRAPHQL_PORT = 4000;
const UPLOAD_PORT = 4001;

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

  const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (
      req: Request,
      file: { originalname: string },
      cb: (arg0: null, arg1: string) => void
    ) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const uniqueName = `${baseName}-${timestamp}${ext}`;
      cb(null, uniqueName);
    },
  });
  const upload = multer({ storage });

  app.post(
    "/upload",
    upload.single("image"),
    (req: MulterRequest, res: Response) => {
      if (!req.file) return res.status(400).send("No file uploaded.");
      const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.json({ url });
    }
  );

  app.use("/uploads", express.static("uploads"));
  app.listen(UPLOAD_PORT, () => {
    console.log(
      `📤 Upload server ready at http://localhost:${UPLOAD_PORT}/upload`
    );
  });
};

initialize();
