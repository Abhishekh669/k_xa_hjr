import { getChannel } from "@/lib/actions/channels/channel";
import { currentMember, memberType } from "@/lib/actions/members/member";
import { getAllWorkSpaces, getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchChannels= async(workspaceId : string) =>{
    const response = await getChannel(workspaceId);
    return {
        message: response.message,
        channels : JSON.parse(response.channels as string)
    };
}

export const useGetChannels  = (workspaceId: string) =>{
    return useQuery({
        queryKey : ["getChannels",workspaceId],
        queryFn : () => fetchChannels(workspaceId),
    })
}