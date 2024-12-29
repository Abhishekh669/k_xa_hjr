
import {  JoinWorkspace } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: JoinWorkspace,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkSpaceDetails'] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}