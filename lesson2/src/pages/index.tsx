import {
  subscribeToGameAddedAtom,
  withPoolingAtom,
  withRefetchGamesAtom,
} from "@/modules/games/atoms";
import AddGameForm from "@/modules/games/components/AddGameForm";
import GameItem from "@/modules/games/components/GameItem";
import useAddGameMutation from "@/modules/games/hooks/mutations/useAddGameMutation";
import useGamesQueries from "@/modules/games/hooks/queries/useGamesQueries";
import useGamesSubscriptions from "@/modules/games/hooks/subscriptions/useGamesSubscriptions";
import { notifyMe } from "@/modules/games/utils";

import { Game, GameInputMutation } from "@/__generated__/graphql";
import { NetworkStatus } from "@apollo/client";
import { Spin } from "antd";
import { useAtom } from "jotai";

type GamePayload = Partial<Pick<Game, "title" | "platforms">>;

export default function Home() {
  const [subscribe, setSubscribe] = useAtom(subscribeToGameAddedAtom);
  const [withRefetchGames, setWithRefetchGames] = useAtom(withRefetchGamesAtom);
  const [withPooling, setWithPooling] = useAtom(withPoolingAtom);

  const { data: gameSubscriptionsData } = useGamesSubscriptions();
  const { data, loading, refetch, networkStatus } = useGamesQueries();
  const [addGame] = useAddGameMutation();

  if (loading && networkStatus !== NetworkStatus.refetch) {
    return (
      <div className="min-h-screen h-full min-w-screen flex justify-center items-center">
        <Spin spinning />
      </div>
    );
  }
  const games = data?.games || [];

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
      (game) => game?.title?.toLowerCase() === payload.title?.toLowerCase()
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
        <AddGameForm />

        <div className="max-h-[500px] overflow-y-auto">
          {games.map((game, index) => (
            <GameItem {...game} key={index} />
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
