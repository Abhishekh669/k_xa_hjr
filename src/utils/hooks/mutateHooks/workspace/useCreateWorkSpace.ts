
import { createWorkSpace } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useCreateWorkSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkSpace,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllWorkSpaces'] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}