import { useGetCurrentMember } from "@/utils/hooks/queryHooks/member/useCurrentMember";
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser";
import { useGetWorkspaceDetails } from "@/utils/hooks/queryHooks/workspace/useGetWorkspaces";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import React from "react";
import WorkspaceHeader from "./WorkspaceHeader";
import { MemberType } from "@/types/member.type";
import { SidebarItem } from "./SidebarItem";
import { useGetChannels } from "@/utils/hooks/queryHooks/channel/useGetChannel";
import { ChannelType } from "@/types/channel.type";
import WorkspaceSection from "./WorkspaceSection";
import { useGetWorkspaceMembers } from "@/utils/hooks/queryHooks/member/useGetWorkspaceMember";
import { userDataType } from "./page";
import { Date } from "mongoose";
import UserItem from "./UserItem";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

interface UserType{
  _id : string , 
  name : string ,
  email : string , 
  image ?: string ,
  authProvider : string ,
  emailVerified : Date,
}

interface MembersType{
  _id : string,
  userId :UserType ,
  workspaceId : string,
  role : string 
}

function WorkspaceSideBar() {
  const [_open, setOpen] = useCreateChannelModal()
  const workspaceId = useWorkSpaceId();
  const { data: user } = useGetLoggedInUser();
  const data = { userId: user?._id as string, workspaceId };
  const {
    data: member,
    isLoading: memberLoading,
    isError: memberError,
  } = useGetCurrentMember(data);
  const {
    data: workspace,
    isLoading: workspaceLoading,
    isError: workspaceError,
  } = useGetWorkspaceDetails(data);
  const {
    data: channels,
    isLoading: channelLoading,
    isError: channelError,
  } = useGetChannels(workspaceId);

  const {data : members, isLoading : membersLoading, isError: membersError} = useGetWorkspaceMembers(workspaceId);

  console.log(
  
    "Workspace : ",
    workspace?.workspace,
    "Channels: ",
    channels?.channels,
    "Members" ,members?.members
  );
  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center ">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center ">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full  ">
      <WorkspaceHeader
        workspace={workspace?.workspace as MemberType}
        isAdmin={workspace.workspace.role == "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>
      
      <WorkspaceSection label="Channels" hint="New channel" onNew={member?.member.role=="admin" ? () => setOpen(true) : undefined}>
        {channels?.channels?.map((item: ChannelType) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New Direct Messages" onNew={() => {}}>
      {members?.members.map((item : MembersType)=>(
        <div>
          <UserItem 
            key={item._id}
            id={item._id}
            label={item.userId.name}
            image={item.userId.image}
          />
          </div>
      ))}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSideBar;
