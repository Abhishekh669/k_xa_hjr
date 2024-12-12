import { getAllWorkSpaces, getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchAllWorkSpaces = async(userId : string) =>{
    const response = await getAllWorkSpaces(userId);
    return {
        message: response.message,
        workspaces : JSON.parse(response.workspaces)
    };
}

export const useGetAllWorkSpaces  = (userId : string) =>{
    return useQuery({
        queryKey : ["getAllWorkSpaces",userId],
        queryFn : () => fetchAllWorkSpaces(userId),
    })
}