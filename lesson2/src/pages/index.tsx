import {
  useQuery,
  gql,
  NetworkStatus,
  useMutation,
  useSubscription,
} from "@apollo/client";
import { Spin } from "antd";
import { useEffect, useState } from "react";

type Game = {
  id: string;
  title: string;
  platform: string[];
  reviews: string[];
};

const GET_GAME = gql`
  query GetGames {
    games {
      title
      id
    }
  }
`;

const ADD_GAME = gql`
  mutation AddGame($game: GameInputMutation) {
    addGame(game: $game) {
      title
      id
    }
  }
`;

const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      title
      id
    }
  }
`;

const GAME_SUBSCRIPTIONS = gql`
  subscription GameAdded {
    gameAdded {
      id
      title
    }
  }
`;

const notifyMe = (message: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    const notification = new Notification(message);
  } else if (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(message);
      }
    });
  }
};

export default function Home() {
  const [subscribe, setSubscribe] = useState(false);

  const { data: gameSubscriptionsData } = useSubscription(GAME_SUBSCRIPTIONS, {
    skip: !subscribe,
  });

  const { data, loading, refetch, networkStatus } = useQuery(GET_GAME, {
    notifyOnNetworkStatusChange: true,
  });

  const [deleteGame, { loading: deleteGameLoading }] = useMutation(
    DELETE_GAME,
    {
      refetchQueries: [GET_GAME],
    }
  );

  const [addGame] = useMutation(ADD_GAME, {
    update: (cache, { data: { addGame } }) => {
      cache.modify({
        fields: {
          games(existingGames = []) {
            const newGameRef = cache.writeFragment({
              data: addGame,
              fragment: gql`
                fragment NewGame on Game {
                  id
                  title
                }
              `,
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="mb-6">
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            const formData = new FormData(form);
            let payload: Record<string, string | string[]> = {};

            formData.forEach((value, key) => {
              if (key === "platforms") {
                payload[key] = (value as string).split(",");
                return;
              }

              payload[key] = value as string;
            });

            addGame({
              variables: {
                game: payload,
              },
            });

            if (subscribe) {
              notifyMe(`
                new game added!, ${payload.title} with platforms ${payload.platforms}
              `);
            }
          }}
          className="flex gap-4"
        >
          <input type="text" name="title" required />
          <input type="text" name="platforms" required />
          <button type="submit">Add Game</button>
        </form>
      </div>

      {games.map((game) => {
        return (
          <div key={game.id} className="flex justify-between w-max gap-4">
            <span>{game.title}</span>
            <button
              disabled={deleteGameLoading}
              onClick={() => deleteGameHandler(game.id)}
            >
              Delete
            </button>
          </div>
        );
      })}

      {networkStatus === NetworkStatus.refetch && <p>Refetching...</p>}

      <button className="w-max" onClick={() => refetch()}>
        Refetch
      </button>

      <button onClick={() => setSubscribe(!subscribe)}>
        {subscribe ? "Unsubscribe" : "Subscribe"}
      </button>
    </div>
  );
}
