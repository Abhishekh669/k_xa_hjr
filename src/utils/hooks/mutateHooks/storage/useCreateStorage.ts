
import { createStorage } from "@/lib/actions/storage/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateStorage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStorage,
    
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: [''] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}