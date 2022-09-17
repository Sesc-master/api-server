import {buildSchema, PubSubEngine} from "type-graphql";
import TimingsResolver from "./api/resolvers/timingsResolver";
import {ApolloServer} from "apollo-server-express";
import {PubSub} from "graphql-subscriptions";
import SchedulesResolver from "./api/resolvers/schedulesResolver";
import AnnouncementsResolver from "./api/resolvers/announcementsResolver";
import {announcementsUpdater, rootUpdaters, schedulesUpdater} from "./updaters";
import IDsResolver from "./api/resolvers/IDsResolver";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";
import {createServer} from "http";
import express from "express";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import ApolloServerPluginDrainWSServer from "./utils/apolloServerPluginDrainWSServer";
import {announcementsOnChange, schedulesOnChange} from "./utils/updaters/onChangeFunctions";
import {env} from "process";
import {config} from "dotenv-flow";

config();
const port = parseInt(env.PORT ?? "4000");

async function bootstrap () {
    const pubSub: PubSubEngine = new PubSub();

    await Promise.all(rootUpdaters.map(rootUpdater => rootUpdater.update()));
    announcementsUpdater.onChange = announcementsOnChange(pubSub, announcementsUpdater.name);
    schedulesUpdater.onChange = schedulesOnChange(pubSub, schedulesUpdater.name);

    const schema = await buildSchema({
        resolvers: [TimingsResolver, SchedulesResolver, AnnouncementsResolver, IDsResolver],
        pubSub
    });

    const app = express();

    const httpServer = createServer(app);
    const webSocketServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, webSocketServer);

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginDrainWSServer(serverCleanup),
            (env.GRAPHQL_LANDING_PAGE === "playground" ?
                ApolloServerPluginLandingPageGraphQLPlayground() :
                ApolloServerPluginLandingPageDisabled()
            )
        ]
    });

    await server.start();
    server.applyMiddleware({ app });

    httpServer.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}/graphql`);
    });
}

bootstrap();