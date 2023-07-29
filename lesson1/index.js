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
      games: () => db.games,
      game: (_, args) => {
        return db.games.find((game) => game.id === args.id);
      },
      reviews: () => db.reviews,
      review: (_, args) => {
        return db.reviews.find((review) => review.id === args.id);
      },
      authors: () => db.authors,
      author: (_, args) => {
        return db.authors.find((author) => author.id === args.id);
      },
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
