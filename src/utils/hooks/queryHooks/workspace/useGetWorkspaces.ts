import { userDataType } from "@/app/(slack)/slack/workspace/[workspaceId]/page";
import { getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchWorkspaceDetails = async(data : userDataType) =>{
    const response = await getWorkspaceDetails(data);
    return {
        message : response.message,
        workspace : JSON.parse(response.workspace)
    };
}

export const useGetWorkspaceDetails = (data : userDataType) =>{
    return useQuery({
        queryKey : ["getWorkSpaceDetails",data],
        queryFn : () => fetchWorkspaceDetails(data),
    })

}