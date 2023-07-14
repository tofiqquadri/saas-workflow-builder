import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import typeDefs from '../../../db/schema';
import resolvers from '../../../db/resolvers';
import connectDb from '../../../db/config';

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const handler = startServerAndCreateNextHandler(server);

export async function GET(request) {
    connectDb();
    return handler(request);
}

export async function POST(request) {
    connectDb();
    return handler(request);
}
