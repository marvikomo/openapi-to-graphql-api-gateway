import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import config from './app/config/config';
import di from './app/config/di';
import typeDefs from './app/graphql/queries';
import resolvers from './app/graphql/resolvers';
import { LoggerService } from './app/services/logger.service';

const logger: LoggerService = di.get('logger');

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// interface Context {
//   token?: string;
//   currentUser?: ICurrentUser;
// }

const app = express();
const httpServer = http.createServer(app);

export const createApolloServer = async (
  listenOptions = { port: config.web.port }
) => {
  const server = new ApolloServer<any>({
    schema,
    introspection: config.web.environment !== 'production',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
    //   context: async ({ req }) => {
    //     const authHeader = req.headers.authorization;
    //     let currentUser: JwtPayload | string = null;
    //     if (authHeader) {
    //       // Bearer ....
    //       const token = authHeader.split('Bearer ')[1];
    //       if (token) {
    //         try {
    //           currentUser = Helpers.verifyJwtToken(token, config.web.jwt_secret);
    //           return { currentUser, token };
    //         } catch (err) {
    //           throw new GraphQLError('Invalid/Expired token');
    //         }
    //       }
    //       throw new Error("Authentication token must be 'Bearer [token]");
    //     }
    //   },
    })
  );
  app.use(express.json());

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: listenOptions.port }, resolve)
  );

  logger.log(`🚀 Server ready at port: ${listenOptions.port}`);
};
createApolloServer();
