"use client"
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useGetChannels } from '@/utils/hooks/queryHooks/channel/useGetChannel';
import { useGetLoggedInUser } from '@/utils/hooks/queryHooks/user/useGetLogedInUser';
import { useGetWorkspaceDetails } from '@/utils/hooks/queryHooks/workspace/useGetWorkspaces';
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id';
import { Loader, TriangleAlert } from 'lucide-react';
import {  useRouter, } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'

export interface userDataType{
  userId : string,
  workspaceId : string
}

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [wOpen, setWopen] = useCreateWorkspaceModal();
  const {data:user, isError : error , isLoading: loading} = useGetLoggedInUser();
  const userData:userDataType = {
    userId : user?._id as string,
    workspaceId 
  }
  console.log("this is hte userData : ",userData)
  const {data : workspace, isError: workspaceError, isLoading:workspaceLoading} = useGetWorkspaceDetails(userData);
  console.log("this is hte workspace Id : ")
  const {data : channels, isLoading:channelsLoading} = useGetChannels(workspaceId);
  const channelId = useMemo(()=> channels?.channels[0]?._id ,[channels]);
  const giveWorkspaceId = useMemo(()=> workspace?.workspace?._id ,[workspace]);

  


  useEffect(()=>{
    if(workspaceLoading || channelsLoading || !workspace)return;
    if(giveWorkspaceId){
      setWopen(false)
    }else if(!wOpen){
      setOpen(true)
    }
    if(channelId){
      setOpen(false)
      router.push(`/slack/workspace/${workspaceId}/channel/${channelId}`)
    }
    else if(!open){
      setOpen(true)
    }
  },[channelId, workspaceLoading, channelsLoading, workspace, workspaceId, open, setOpen, giveWorkspaceId, router])
  

  if(workspaceLoading || channelsLoading){
    return (
      <div className=' min-h-screen flex flex-1 items-center justify-center flex-col gap-2 '>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if(!workspace){
    return(
      <div className=' min-h-screen flex flex-1 items-center justify-center flex-col gap-2 '>
        <TriangleAlert className='size-6 animate-spin text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>
          Workspace not found
        </span>
      </div>
    )
  }
  return null;
}
export default WorkSpaceIdPage



 // if(workspaceId == "undefined")  return redirect("/slack");
  // const [_opening, setOpening] = useCreateWorkspaceModal();
  
  // useEffect(() =>{
  //   // const helloworld = async() =>{
  //   //     const data = await getChannel(workspaceId as string);
  //   // }
  //   // helloworld();
  //   if(!!data && !isError && !isLoading){
  //     setOpening(false);
  //   }
  // },[data, isError, isLoading, setOpen])
  
  // if(isLoading){
  //   return <div>Loading....</div>
  // }
  // if(!isLoading && !data?.workspace && isError ) return <div>No workspace avialabe</div>
  
  // if(!isLoading && !isError && data?.workspace)