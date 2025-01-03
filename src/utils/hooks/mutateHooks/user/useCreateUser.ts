
import { createUser } from "@/lib/actions/user-actions/create.user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['createUser'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}