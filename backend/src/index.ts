import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "reflect-metadata";
import { dataSource } from "./config/db";
import { getSchema } from "./schema";

const port = 4000;

const initialize = async () => {
    const schema = await buildSchema({
        resolvers: [
            UserResolver,
            ProfileResolver,
            CategoryResolver,
            ProductResolver,
            SearchResolver,
            VariantResolver,
            StoreResolver,
            StoreVariantResolver,
        ],
        authChecker,
    });
    const server = new ApolloServer({schema});
    await dataSource.initialize();
    const {url} = await startStandaloneServer(server, {
        listen: {port: port},
        context: async ({req, res}) => {
            return {req, res};
        },
    });
    console.log(`Server ready at: ${url} 🚀`);
};

initialize();
