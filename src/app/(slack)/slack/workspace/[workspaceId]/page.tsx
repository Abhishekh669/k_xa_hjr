"use client"
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { getChannel } from '@/lib/actions/channels/channel';
import { useGetLoggedInUser } from '@/utils/hooks/queryHooks/user/useGetLogedInUser';
import { useGetWorkspaceDetails } from '@/utils/hooks/queryHooks/workspace/useGetWorkspaces';
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id';
import { redirect, } from 'next/navigation';
import React, { useEffect } from 'react'

export interface userDataType{
  userId : string,
  workspaceId : string
}

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  if(workspaceId == "undefined")  return redirect("/slack");
 const {data:user, isError : error , isLoading: loading} = useGetLoggedInUser();
  const [open, setOpen] = useCreateWorkspaceModal();
  const userData:userDataType = {
    userId : user?._id as string,
    workspaceId 
  }
  const {data, isError, isLoading} = useGetWorkspaceDetails(userData);
  useEffect(() =>{
    // const helloworld = async() =>{
    //     const data = await getChannel(workspaceId as string);
    // }
    // helloworld();
    if(!!data && !isError && !isLoading){
      setOpen(false);
    }
  },[data, isError, isLoading, setOpen])
  
  if(isLoading){
    return <div>Loading....</div>
  }
  if(!isLoading && !data?.workspace && isError ) return <div>No workspace avialabe</div>
  
  if(!isLoading && !isError && data?.workspace)
  return (
    <div>
      ID : {JSON.stringify(data?.workspace)}
    </div>
  )
}

export default WorkSpaceIdPage
