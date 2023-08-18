import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import pkg from "body-parser";

import { typeDefs } from "./schema.js";

import WebSocket, { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { PubSub } from "graphql-subscriptions";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express";

const app = express();
const { json } = pkg;
const pubsub = new PubSub();

// db
import db from "./_db.js";
import { makeExecutableSchema } from "@graphql-tools/schema";

const resolvers = {
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
        id: Math.floor(Math.random() * 1000),
        title: args.game.title,
        platforms: args.game.platforms,
        reviews: [],
      };

      pubsub.publish("GAME_ADDED", { gameAdded: newGame });

      db.games.push(newGame);
      return newGame;
    },
    updateGame: (_, args) => {
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          return {
            ...game,
            ...args.game,
          };
        }

        return game;
      });

      return db.games.find((game) => game.id === args.id);
    },
  },
  Subscription: {
    gameAdded: {
      subscribe: () => pubsub.asyncIterator(["GAME_ADDED"]),
    },
  },
};

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

const httpServer = http.createServer(app);

// WebSocket server setup
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
});

await server.start();

app.use("/graphql", cors("*"), json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
