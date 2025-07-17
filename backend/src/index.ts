import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import "reflect-metadata";
import sharp from "sharp";
import stripe from "stripe";
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

        const url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
        res.json({ url });
      } catch (error) {
        console.error("Sharp error:", error);
        res.status(500).send("Image processing failed");
      }
    }
  );

  // déplacer dans un fichier
  const endpointSecret =
    process.env.NODE_ENV === "prod"
      ? "whsec_lBcDGIVswC7Aa2AHCxhTOEw6xInLauX6"
      : "whsec_c6d922119d25614183d29490761406100489589329af62b0d508a08072ba682e";

  app.post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    (request, response) => {
      // insert stripe_webhooks
      let event = request.body;
      console.log(event);
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers["stripe-signature"] as string;
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err: any) {
          console.log(
            `⚠️  Webhook signature verification failed.`,
            err.message
          );
          return response.sendStatus(400);
        }

        // Handle the event
        // si le call est vérifié on update la table payment + (trigger ou update order status)
        switch (event.type) {
          case "payment_intent.succeeded": {
            console.log(event);
            // const paymentIntent = event.data.object;

            break;
          }
          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        response.json({ received: true });
      } else {
        // Si endpointSecret n'existe pas, répondre quand même
        response.status(400).send("Endpoint secret not configured");
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
