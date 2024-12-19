import { useGetCurrentMember } from '@/utils/hooks/queryHooks/member/useCurrentMember';
import { useGetLoggedInUser } from '@/utils/hooks/queryHooks/user/useGetLogedInUser';
import { useGetWorkspaceDetails } from '@/utils/hooks/queryHooks/workspace/useGetWorkspaces';
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id'
import { AlertTriangle, Loader } from 'lucide-react';
import React from 'react'
import WorkspaceHeader from './WorkspaceHeader';
import { MemberType } from '@/types/member.type';

function WorkspaceSideBar() {
    const workspaceId = useWorkSpaceId();
    const {data : user} = useGetLoggedInUser();
    const data = {userId : user?._id as string, workspaceId}
    const {data : member, isLoading : memberLoading, isError : memberError} = useGetCurrentMember(data);
    const {data : workspace, isLoading : workspaceLoading, isError : workspaceError} = useGetWorkspaceDetails(data);
    console.log("Member : ",member, "Workspace : ",workspace?.workspace)
    if(workspaceLoading || memberLoading){
        return (
            <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center '>
                <Loader className='size-5 animate-spin text-white' />

            </div>
        )
    }
    if(!workspace || !member){
        return (
            <div className='flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center '>
                <AlertTriangle className='size-5  text-white' />
                <p className="text-white text-sm">
                    Workspace not found
                </p>
            </div>
        )
    }
  return (
    <div className='flex flex-col bg-[#5E2C5F] h-full  '>
        <WorkspaceHeader workspace={workspace?.workspace as MemberType}  isAdmin={workspace.workspace.role == "admin"}/>

    </div>
  )
}

export default WorkspaceSideBar
