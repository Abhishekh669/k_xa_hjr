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

function WorkspaceSideBar() {
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

  console.log(
    "Member : ",
    member,
    "Workspace : ",
    workspace?.workspace,
    "Channels: ",
    channels
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
      <WorkspaceSection label="Channels" hint="New channel" onNew={() => {}}>
        {channels?.channels?.map((item: ChannelType) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSideBar;
