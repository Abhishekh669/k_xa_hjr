
import { createWorkSpace, updateWorkSpace } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWorkSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkSpaceDetails'] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}