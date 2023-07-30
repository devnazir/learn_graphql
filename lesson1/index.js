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
    Game: {
      reviews: (parent) => {
        return db.reviews.filter((review) => review.game_id === parent.id);
      },
    },
    Review: {
      game: (parent) => {
        return db.games.find((game) => game.id === parent.game_id);
      },
      author: (parent) => {
        return db.authors.find((author) => author.id === parent.author_id);
      },
    },
    Author: {
      reviews: (parent) => {
        return db.reviews.filter((review) => review.author_id === parent.id);
      },
    },
    Mutation: {
      deleteGame: (_, args) => {
        db.games = db.games.filter((game) => game.id !== args.id);
        return db.games;
      },
      addGame: (_, args) => { 
        const newGame = {
          id: String(db.games.length + 1),
          title: args.game.title,
          platforms: args.game.platforms,
          reviews: [],
        };

        db.games.push(newGame);
        return newGame;
      },
      updateGame: (_, args) => { 
        db.games = db.games.map(game => {
          if(game.id === args.id) { 
            return {
              ...game,
              ...args.game
            }
          }

          return game;
        })

        return db.games.find(game => game.id === args.id);
      }
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
