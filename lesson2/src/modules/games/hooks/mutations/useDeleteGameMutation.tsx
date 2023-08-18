import { DeleteGameMutation } from "@/__generated__/graphql";
import { MutationHookOptions, useMutation } from "@apollo/client";
import { DELETE_GAME, GET_GAME } from "../../graphql/queries";

const useDeleteGameMutation = (props?: MutationHookOptions) => {
  const mutation = useMutation<DeleteGameMutation>(DELETE_GAME, {
    refetchQueries: [GET_GAME],
    ...props,
  });

  return mutation;
};

export default useDeleteGameMutation;
