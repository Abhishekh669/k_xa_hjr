
import { getNewJoinCode } from "@/lib/actions/workspaces/workspaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useNewJoinCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getNewJoinCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getWorkSpaceDetails'] })
    },
    onError: (error) => { 
    },
    onSettled: () => { },
    onMutate: () => { },
})
}