import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { useGetCurrentMember } from "@/utils/hooks/queryHooks/member/useCurrentMember";
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser";
interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data?: any | undefined;
  loadMore?: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dataStr: string) => {
  const date = new Date(dataStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
};

const TIME_THRESHOLD = 5;

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState(null);
  const workspaceId = useWorkSpaceId();
  const {data: user } = useGetLoggedInUser();
  const {data : current_member} = useGetCurrentMember({userId : user?._id as string , workspaceId});
  const groupedMessages = data?.reduce((groups, message) => {
    const date = new Date(message._doc.createdAt);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof data>);
  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-sx border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user?._id &&
              differenceInMinutes(
                new Date(message?._doc?.createdAt),
                new Date(prevMessage?._doc?.createdAt)
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message?._doc?._id}
                id={message?._doc?._id}
                memberId={message?._doc?.memberId}
                authorImage={message?.user?.image}
                authorName={message?.user?.name}
                isAuthor={message?.message.memberId === current_member?.member?._id}
                reactions={message?.reactions}
                body={message?._doc?.body}
                image={message?.image?.fileUrl}
                createdAt={message?._doc?.createdAt}
                isEditing={editingId === message._doc._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={false}
                threadCount={message?.threadCount}
                threadImage={message?.threadImage}
                threadTimeStamp={message?.threadTimestamp}
              />
            );
          })}
        </div>
      ))}

      {variant == "channel" && channelName && channelCreationTime && (
        <ChannelHero 
            name={channelName}
            creationtime={channelCreationTime}
        />
      )}
    </div>
  );
};
