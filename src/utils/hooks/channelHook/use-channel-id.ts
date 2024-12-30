import { useParams } from "next/navigation";

export const useChannelId = () =>{
    const params = useParams<{channelId: string}>();
    return params.channelId;
}