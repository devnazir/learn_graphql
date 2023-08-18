import { gql } from "@/__generated__";
import { MutationHookOptions, useMutation } from "@apollo/client";
import { useAtomValue } from "jotai";
import { withRefetchGamesAtom } from "../../atoms";
import { ADD_GAME, GET_GAME } from "../../graphql/queries";

const useAddGameMutation = (props?: MutationHookOptions) => {
  const withRefetchGames = useAtomValue(withRefetchGamesAtom);

  const mutation = useMutation(ADD_GAME, {
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
    ...props,
  });

  return mutation;
};

export default useAddGameMutation;
