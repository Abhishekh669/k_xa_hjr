import { getWorkspaceMembers } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchWorkspaceMembers= async(workspaceId : string ) =>{
    const response = await getWorkspaceMembers(workspaceId)
    return {
        message : response?.message,
        members : JSON.parse(response?.members as string)
    };
}

export const useGetWorkspaceMembers  = (workspaceId : string ) =>{
    return useQuery({
        queryKey : ["getWorkspaceMembers",workspaceId],
        queryFn : () => fetchWorkspaceMembers(workspaceId),
    })
}