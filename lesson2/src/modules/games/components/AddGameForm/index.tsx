import { Game, GameInputMutation } from "@/__generated__/graphql";
import { useAtomValue } from "jotai";
import { subscribeToGameAddedAtom } from "../../atoms";
import useAddGameMutation from "../../hooks/mutations/useAddGameMutation";
import useGamesQueries from "../../hooks/queries/useGamesQueries";
import { notifyMe } from "../../utils";

type GamePayload = Partial<Pick<Game, "title" | "platforms">>;
type KeyOfGamePayload = keyof GamePayload;
type ValueOfGamePayload = GamePayload[KeyOfGamePayload];

const AddGameForm = () => {
  const subscribe = useAtomValue(subscribeToGameAddedAtom);

  const { data } = useGamesQueries();
  const games = (data?.games || []) as Game[];
  const [addGame] = useAddGameMutation();

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

  return (
    <form method="POST" onSubmit={handleSubmit} className="flex  gap-4 mb-4">
      <input type="text" name="title" required placeholder="Title" />
      <input type="text" name="platforms" required placeholder="Platforms" />
      <button className="bg-blue-500 text-white rounded py-2 px-4 grow cursor-pointer">
        Add Game
      </button>
    </form>
  );
};

export default AddGameForm;
