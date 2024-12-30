
import {  updateChannel } from "@/lib/actions/channels/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateChannel,
    
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['getIndividualChannel'] })
      queryClient.invalidateQueries({ queryKey: ['getChannels'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}