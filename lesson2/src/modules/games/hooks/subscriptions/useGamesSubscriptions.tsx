import { GameAddedSubscription } from "@/__generated__/graphql";
import { SubscriptionHookOptions, useSubscription } from "@apollo/client";
import { useAtomValue } from "jotai";
import { subscribeToGameAddedAtom } from "../../atoms";
import { GAME_SUBSCRIPTIONS } from "../../graphql/queries";

const useGamesSubscriptions = (props?: SubscriptionHookOptions) => {
  const subscribe = useAtomValue(subscribeToGameAddedAtom);

  const subscriptions = useSubscription<GameAddedSubscription>(
    GAME_SUBSCRIPTIONS,
    {
      skip: !subscribe,
      ...props,
    }
  );

  return subscriptions;
};

export default useGamesSubscriptions;
