
import { createWorkSpace, deleteWorkSpace } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useDeleteWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkSpace,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [''] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}