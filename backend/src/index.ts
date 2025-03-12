import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import { dataSource } from "./config/db";
import { getUserFromContext } from "./helpers/helpers";
import { getSchema } from "./schema";
import { ContextType } from "./types";

const port = 4000;

const initialize = async () => {
  const schema = await getSchema();
  const server = new ApolloServer({ schema });
  await dataSource.initialize();

  const { url } = await startStandaloneServer(server, {
    listen: { port: port },
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
};

initialize();
