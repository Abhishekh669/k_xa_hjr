"use client";
import { useChannelId } from "@/utils/hooks/channelHook/use-channel-id";
import { useGetIndiviudalChannel } from "@/utils/hooks/queryHooks/channel/useGetIndividualChannel";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";
import Header from "./Header";
import ChatInput from "./ChatInput";
import { useGetMessage } from "@/utils/hooks/queryHooks/message/useGetMessage";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { MessageList } from "@/components/message-list";
function ChannelIdPage() {
  const channelId = useChannelId();
  const workspaceId  = useWorkSpaceId();
  const {data  : results, isLoading : reusltLoading} = useGetMessage({
    channelId,
    workspaceId,
     paginationOpts: { page: 1, limit: 10 },
  });
  console.log("this is the result : ",results)
  const { data: channel, isLoading: channelLoading } = useGetIndiviudalChannel(channelId);

  if (channelLoading || reusltLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }
  if (!channel) {
    return (
      <div className="h-full flex-1 flex items-center justify-center gap-x-2">
        <TriangleAlert className=" size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col  h-full w-full ">
      <Header name={channel?.channel?.name} />
      <div className="flex-1" />
      <MessageList 
        channelName={channel?.channel?.name}
        channelCreationTime={channel?.channel?.createdAt}
        data={results?.results}
        isLoadingMore={status==="LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message # ${channel?.channel?.name}`} />
    </div>
  );
}

export default ChannelIdPage;
