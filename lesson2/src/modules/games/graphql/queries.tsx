import { gql } from "@/__generated__";

export const GET_GAME = gql(`
  query GetGames {
    games {
      title
      id
      ...ReviewsGame
    }
  }
`);

export const ReviewsGameFragment = gql(`
  fragment ReviewsGame on Game {
    reviews {
      id
      content
    }
  }
`);

export const ADD_GAME = gql(`
  mutation AddGame($game: GameInputMutation) {
    addGame(game: $game) {
      title
      id
    }
  }
`);

export const DELETE_GAME = gql(`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      title
      id
    }
  }
`);

export const GAME_SUBSCRIPTIONS = gql(`
  subscription GameAdded {
    gameAdded {
      title
    }
  }
`);