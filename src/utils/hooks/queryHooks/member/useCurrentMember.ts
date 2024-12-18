import { currentMember, memberType } from "@/lib/actions/members/member";
import { getAllWorkSpaces, getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchCurrentMember= async(data : memberType) =>{
    const response = await currentMember(data);
    return {
        message: response.message,
        member : JSON.parse(response.member as string)
    };
}

export const useGetCurrentMember  = (data : memberType) =>{
    return useQuery({
        queryKey : ["getCurrentMember",data],
        queryFn : () => fetchCurrentMember(data),
    })
}