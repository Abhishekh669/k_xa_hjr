
import { createChannel } from "@/lib/actions/channels/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChannel,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getChannels'] })
      queryClient.invalidateQueries({ queryKey: ['getIndividualChannel'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}