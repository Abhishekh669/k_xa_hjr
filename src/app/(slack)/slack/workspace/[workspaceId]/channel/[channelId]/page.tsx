"use client"
import { useChannelId } from '@/utils/hooks/channelHook/use-channel-id'
import { useGetIndiviudalChannel } from '@/utils/hooks/queryHooks/channel/useGetIndividualChannel';
import { Loader, TriangleAlert } from 'lucide-react';
import React from 'react'
import Header from './Header';
import ChatInput from './ChatInput';
function ChannelIdPage() {
  const channelId = useChannelId();
  const {data : channel, isLoading: channelLoading} = useGetIndiviudalChannel(channelId)

  if(channelLoading){
    return (
      <div className='h-full flex-1 flex items-center justify-center'>
          <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    )
  }
  if(!channel){
    return (
      <div className='h-full flex-1 flex items-center justify-center gap-x-2'>
          <TriangleAlert className=" size-5 text-muted-foreground" />
          <span className='text-sm text-muted-foreground'>Channel not found</span>
      </div>
    )
  }

  return (
    <div className='flex flex-col  h-full w-full '> 
    <Header name={channel?.channel?.name} />
    <div className='flex-1' />
    <ChatInput placeholder={`Message # ${channel?.channel?.name}`} />
    </div>
  )
}

export default ChannelIdPage
