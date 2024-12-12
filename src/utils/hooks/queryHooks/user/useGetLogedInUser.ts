import { getLogedInUser } from "@/lib/actions/user-actions/get.user";
import { getAllWorkSpaces, getWorkspaceDetails } from "@/lib/actions/workspaces/workspaces";
import { useQuery } from "@tanstack/react-query";

export  const fetchLoggedInUser = async() =>{
    const response = await getLogedInUser();
    return response;
}

export const useGetLoggedInUser  = () =>{
    return useQuery({
        queryKey : ["getLoggedInUser"],
        queryFn : () => fetchLoggedInUser(),
    })
}