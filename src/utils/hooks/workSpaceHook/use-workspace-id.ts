import { useParams } from "next/navigation";

export const useWorkSpaceId = () =>{
    const params = useParams<{workspaceId : string}>();
    return params.workspaceId;
}