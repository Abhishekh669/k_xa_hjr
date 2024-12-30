
import {  deleteChannel } from "@/lib/actions/channels/channel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChannel,
    
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['getChannels'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}