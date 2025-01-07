import { get_message } from "@/lib/actions/messages/messages";
import { useQuery } from "@tanstack/react-query";

export  const fetchMessage = async(data : any) =>{
    const response = await get_message(data);
    return {
        message : response.message,
        results : JSON.parse(response.results),
        pagination : JSON.parse(response.pagination)
    }
}

export const useGetMessage  = (data : any) =>{
    return useQuery({
        queryKey : ["getMessage", data],
        queryFn : () => fetchMessage(data),
    })
}