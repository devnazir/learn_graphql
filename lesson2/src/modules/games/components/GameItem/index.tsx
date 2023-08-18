import { Game } from "@/__generated__/graphql";

import useDeleteGameMutation from "../../hooks/mutations/useDeleteGameMutation";

const GameItem = (game: Game) => {
  const [deleteGame, { loading: deleteGameLoading }] = useDeleteGameMutation();

  const deleteGameHandler = (gameId: string) => {
    deleteGame({
      variables: {
        id: gameId,
      },
    });
  };

  return (
    <div className="bg-gray-200 p-4 rounded flex justify-between items-center mb-2">
      <span>{game.title}</span>
      <button
        className="bg-red-500 text-white rounded py-1 px-2 cursor-pointer"
        disabled={deleteGameLoading}
        onClick={() => deleteGameHandler(game.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default GameItem;
