import { gql } from "@/__generated__";
import { Game } from "@/__generated__/graphql";
import { useFragment } from "@apollo/client";

import useDeleteGameMutation from "../../hooks/mutations/useDeleteGameMutation";

export const ReviewsGameFragment = gql(`
  fragment ReviewsGame on Game {
    reviews {
      id
      content
    }
  }
`);

const GameItem = (game: Partial<Game>) => {
  const [deleteGame, { loading: deleteGameLoading }] = useDeleteGameMutation();

  const fragmentData = useFragment({
    fragment: ReviewsGameFragment,
    fragmentName: "ReviewsGame",
    from: game,
  });

  console.log(fragmentData);

  const deleteGameHandler = (gameId: string | undefined) => {
    if (!gameId) return;
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
        onClick={() => deleteGameHandler(game?.id)}
      >
        Delete
      </button>
    </div>
  );
};

export default GameItem;
