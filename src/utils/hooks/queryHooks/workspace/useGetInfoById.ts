import { getAllWorkSpaces, getInfoById, getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchInfo= async(workspaceId : string) =>{
    const response = await getInfoById(workspaceId);
    return {
        message: response?.message ,
        info : JSON.parse(response?.info as string)
    };
}

export const useGetInfoById = (workspaceId : string) =>{
    return useQuery({
        queryKey : ["getInfoById",workspaceId],
        queryFn : () => fetchInfo(workspaceId),
    })
}