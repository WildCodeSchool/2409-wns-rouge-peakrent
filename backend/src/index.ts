import "reflect-metadata";
import {dataSource} from "./config/db";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {buildSchema} from "type-graphql";
import {CategoryResolver} from "./resolver/Categories";
import {ProductResolver} from "./resolver/Products";
import {SearchResolver} from "./resolver/Searchs";
import {UserResolver} from "./resolver/Users";
import {authChecker} from "./auth";
import {VariantResolver} from "./resolver/Variants";
import {ProfileResolver} from "./resolver/Profiles";
import { StoreVariantResolver } from "./resolver/StoresVariants";
import { StoreResolver } from "./resolver/Stores";

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
