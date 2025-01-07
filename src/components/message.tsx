interface MessageProps {
  id: string;
  memberId: string;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: any;
  body: string;
  image: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: string) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimeStamp?: number;
}
import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import Hint from "./Hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
const Renderer = dynamic(() => import("@/components/renderer"));

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMM d, yyyy")
  } at ${format(date, "h:mm:ss a")}`;
};
export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimeStamp,
}: MessageProps) => {
  const avatarFallback = authorName.charAt(0).toUpperCase();
  if (isCompact) {
    return (
      <>
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-slate-300 rounded-[5px] group relative ">
          <div>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button
                className={
                  "text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline"
                }
              >
                {format(new Date(createdAt), "hh:mm:ss")}
              </button>
            </Hint>
            <div className="flex flex-col w-full">
              <Renderer value={body} />
              <Thumbnail url={image}/>
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="flex flex-col gap-2 p-1.5 px-5  hover:bg-slate-300  hover:rounded-[5px] group relative ">
      <div className="flex items-start gap-2">
        <button>
          <Avatar className=" rounded-[5px]  bg-blue-500">
            <AvatarImage className="rounded-md " src={authorImage} />
            <AvatarFallback className="rounded-md text-md font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              className="font-bold text-primary hover:text-muted-foreground"
              onClick={() => {}}
            >
              {authorName}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), "h:mm a")}
              </button>
            </Hint>
          </div>
          <Renderer value={body} />
          <Thumbnail url={image}/>
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(edited)</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
