import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import path from "path";
import "reflect-metadata";
import { dataSource } from "./config/db";
import { getUserFromContext } from "./helpers/helpers";
import app from "./rest/express";
import "./rest/stripeWebhook";
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

  app.use("/uploads", express.static(UPLOADS_DIR));
  app.listen(UPLOAD_PORT, () => {
    console.log(
      `📤 Upload server ready at http://localhost:${UPLOAD_PORT}/upload`
    );
  });
};

initialize();
