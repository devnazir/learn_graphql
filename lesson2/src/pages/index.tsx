import { gql } from "@/__generated__";
import { Game, GameInputMutation } from "@/__generated__/graphql";
import {
  useQuery,
  NetworkStatus,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { Spin } from "antd";
import { useState } from "react";

const GET_GAME = gql(`
  query GetGames {
    games {
      title
      id
    }
  }
`);

const ADD_GAME = gql(`
  mutation AddGame($game: GameInputMutation) {
    addGame(game: $game) {
      title
      id
    }
  }
`);

const DELETE_GAME = gql(`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      title
      id
    }
  }
`);

const GAME_SUBSCRIPTIONS = gql(`
  subscription GameAdded {
    gameAdded {
      title
    }
  }
`);

type GamePayload = Partial<Pick<Game, "title" | "platforms">>;
type KeyOfGamePayload = keyof GamePayload;
type ValueOfGamePayload = GamePayload[KeyOfGamePayload];

const notifyMe = (message: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification("There is new Game!", {
      body: message,
      icon: "/favicon.ico",
      vibrate: [200, 100, 200],
    });
  } else if (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("There is new Game!", {
          body: message,
          icon: "/favicon.ico",
          vibrate: [200, 100, 200],
        });
      }
    });
  }
};

export default function Home() {
  const [subscribe, setSubscribe] = useState(false);
  const [withRefetchGames, setWithRefetchGames] = useState(false);
  const [withPooling, setWithPooling] = useState(false);

  const { data: gameSubscriptionsData } = useSubscription(GAME_SUBSCRIPTIONS, {
    skip: !subscribe,
  });

  const { data, loading, refetch, networkStatus } = useQuery(GET_GAME, {
    notifyOnNetworkStatusChange: true,
    ...(withPooling
      ? { pollInterval: 1000 }
      : {
          pollInterval: 0,
        }),
  });

  const [deleteGame, { loading: deleteGameLoading }] = useMutation(
    DELETE_GAME,
    {
      refetchQueries: [GET_GAME],
    }
  );

  const [addGame] = useMutation(ADD_GAME, {
    ...(withRefetchGames
      ? {
          update: (cache, { data }) => {
            const addGame = data?.addGame;

            cache.modify({
              fields: {
                games(existingGames = []) {
                  const newGameRef = cache.writeFragment({
                    data: addGame,
                    fragment: gql(`
                fragment NewGame on Game {
                  id
                  title
                }
              `),
                  });

                  return [...existingGames, newGameRef];
                },
              },
            });
          },
          refetchQueries: [GET_GAME],
          onQueryUpdated: (observableQuery) => {
            observableQuery.refetch();
          },
        }
      : {}),
  });

  if (loading && networkStatus !== NetworkStatus.refetch) {
    return (
      <div className="min-h-screen h-full min-w-screen flex justify-center items-center">
        <Spin spinning />
      </div>
    );
  }
  const games = (data?.games || []) as Game[];

  const deleteGameHandler = (gameId: string) => {
    deleteGame({
      variables: {
        id: gameId,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);

    const payload: GamePayload = {};

    formData.forEach((value, key) => {
      const keyValue = key as KeyOfGamePayload;
      const payloadValue = value as ValueOfGamePayload;

      if (keyValue === "platforms") {
        payload[keyValue] = (payloadValue as string).split(",");
      } else {
        if (typeof payloadValue === "string") {
          payload[keyValue] = payloadValue;
        }
      }
    });

    const isGameAlreadyExist = games.some(
      (game) => game.title?.toLowerCase() === payload.title?.toLowerCase()
    );

    if (isGameAlreadyExist) {
      return;
    }

    handleAddGame(payload as GameInputMutation);
  };

  const handleAddGame = (payload: GameInputMutation) => {
    addGame({
      variables: {
        game: payload as GameInputMutation,
      },
    });

    if (subscribe) {
      notifyMe(`
        ${payload.title} is added to the list! 
      `);
    }
  };

  const generateGame = () => {
    const title =
      "Game " +
      Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7);

    const platforms = ["PC", "PS4", "XBOX"];

    const payload: GamePayload = {
      title,
      platforms,
    };

    const isGameAlreadyExist = games.some(
      (game) => game.title?.toLowerCase() === payload.title?.toLowerCase()
    );

    if (isGameAlreadyExist) {
      return;
    }

    handleAddGame(payload as GameInputMutation);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center flex-col gap-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <h1>Learn GraphQL</h1>
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="flex  gap-4 mb-4"
        >
          <input type="text" name="title" required placeholder="Title" />
          <input
            type="text"
            name="platforms"
            required
            placeholder="Platforms"
          />
          <button className="bg-blue-500 text-white rounded py-2 px-4 grow cursor-pointer">
            Add Game
          </button>
        </form>

        <div className="max-h-[500px] overflow-y-auto">
          {games.map((game, index) => (
            <div
              key={game.id + index}
              className="bg-gray-200 p-4 rounded flex justify-between items-center mb-2"
            >
              <span>{game.title}</span>
              <button
                className="bg-red-500 text-white rounded py-1 px-2 cursor-pointer"
                disabled={deleteGameLoading}
                onClick={() => deleteGameHandler(game.id)}
              >
                Delete
              </button>
            </div>
          ))}

          {games.length === 0 && (
            <div className="bg-gray-200 p-4 rounded flex justify-between items-center mb-2">
              <span>No games found</span>
            </div>
          )}
        </div>

        {networkStatus === NetworkStatus.refetch && <p>Refetching...</p>}

        <div className="flex h-max gap-4 my-4">
          <button
            className="bg-blue-500 text-white rounded py-2 px-4 w-max cursor-pointer flex-1"
            onClick={() => refetch()}
          >
            Refetch
          </button>

          <button
            className={`${
              subscribe ? "bg-green-500" : "bg-gray-500"
            } text-white rounded py-2 px-4 cursor-pointer flex-1`}
            onClick={() => setSubscribe(!subscribe)}
          >
            {subscribe ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>

        <div
          className="bg-yellow-500 text-white rounded py-2 px-4 cursor-pointer text-center mb-4"
          onClick={generateGame}
        >
          Generate Game
        </div>

        <div
          className="bg-green-500 text-white rounded py-2 px-4 cursor-pointer text-center"
          onClick={() => setWithRefetchGames(!withRefetchGames)}
        >
          {withRefetchGames
            ? " Without Refetch GET Games"
            : "With Refetch GET Games"}
        </div>

        <div
          className="bg-pink-500 text-white rounded py-2 px-4 cursor-pointer text-center mt-4"
          onClick={() => setWithPooling(!withPooling)}
        >
          {withPooling ? " Without Polling" : "With Polling"}
        </div>
      </div>

      {subscribe && (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
          {gameSubscriptionsData?.gameAdded?.title && (
            <div className="bg-green-500 text-white rounded py-2 px-4 cursor-pointer text-center">
              {gameSubscriptionsData?.gameAdded?.title} is added to the list!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
