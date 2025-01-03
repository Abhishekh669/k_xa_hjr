
import { deleteWorkSpace } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkSpace,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllWorkSpaces'] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}