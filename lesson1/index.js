import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./schema.js";

// db
import db from "./_db.js";

// server setup
const server = new ApolloServer({
  typeDefs, // -- definitions of types of data
  resolvers: {
    Query: {
      games: (params) => {
        return db.games;
      },
      reviews: () => db.reviews,
      authors: () => db.authors,
    },
  },
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`🚀 Server ready at ${url}
`);
