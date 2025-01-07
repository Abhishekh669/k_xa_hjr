
import { createMessage } from "@/lib/actions/messages/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMessage'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}