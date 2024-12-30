import {  getChannelById } from "@/lib/actions/channels/channel";
import { useQuery } from "@tanstack/react-query";

export  const fetchChannel= async(channelId : string) =>{
    const response = await getChannelById(channelId);
    return {
        message: response?.message,
        channel : JSON.parse(response?.channel as string)
    };
}

export const useGetIndiviudalChannel  = (channelId: string) =>{
    return useQuery({
        queryKey : ["getIndividualChannel",channelId],
        queryFn : () => fetchChannel(channelId),
    })
}