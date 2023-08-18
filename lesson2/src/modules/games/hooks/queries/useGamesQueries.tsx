import { GetGamesQuery } from "@/__generated__/graphql";
import { QueryHookOptions, useQuery } from "@apollo/client";
import { useAtomValue } from "jotai";
import { withPoolingAtom } from "../../atoms";
import { GET_GAME } from "../../graphql/queries";

const useGamesQueries = (props?: QueryHookOptions) => {
  const withPooling = useAtomValue(withPoolingAtom);

  const query = useQuery<GetGamesQuery, QueryHookOptions>(GET_GAME, {
    notifyOnNetworkStatusChange: true,
    ...(withPooling
      ? { pollInterval: 1000 }
      : {
          pollInterval: 0,
        }),
    ...props,
  });

  return query;
};

export default useGamesQueries;
