"use client";
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useGetChannels } from '@/utils/hooks/queryHooks/channel/useGetChannel';
import { useGetCurrentMember } from '@/utils/hooks/queryHooks/member/useCurrentMember';
import { useGetLoggedInUser } from '@/utils/hooks/queryHooks/user/useGetLogedInUser';
import { useGetWorkspaceDetails } from '@/utils/hooks/queryHooks/workspace/useGetWorkspaces';
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id';
import { Loader, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

export interface userDataType {
  userId: string;
  workspaceId: string;
}

const WorkSpaceIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();
  const [wOpen, setWopen] = useCreateWorkspaceModal();

  const { data: user, isLoading: userLoading, isError: userError } = useGetLoggedInUser();
  const userData: userDataType = {
    userId: user?._id as string,
    workspaceId,
  };

  const { data: workspace, isLoading: workspaceLoading, isError: workspaceError } = useGetWorkspaceDetails(userData);
  const { data: channels, isLoading: channelsLoading } = useGetChannels(workspaceId);
  const { data: member, isLoading: memberLoading } = useGetCurrentMember(userData);

  const channelId = useMemo(() => channels?.channels[0]?._id, [channels?.channels]);
  const giveWorkspaceId = useMemo(() => workspace?.workspace?._id, [workspace?.workspace]);
  const isAdmin = useMemo(() => member?.member?.role === "admin", [member?.member?.role]);

  // Handle redirects and modals based on conditions
  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

    if (giveWorkspaceId) {
      setWopen(false);
    } else if (!wOpen) {
      setWopen(true);
    }

    // If no channels, redirect to workspace
    if (channels?.channels.length === 0 && isAdmin) {
      router.push(`/slack/workspace/${workspaceId}`);
      setOpen(true)
    } else if (channelId) {
      router.push(`/slack/workspace/${workspaceId}/channel/${channelId}`);
      setOpen(false);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [channelId, workspaceLoading, channelsLoading, workspace, workspaceId, open, setOpen, giveWorkspaceId, router, memberLoading, member, isAdmin]);

  // Loading and Error States
  if (userLoading || workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (userError || workspaceError) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Error loading data
        </span>
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  // When no channels are available, display the message
  return (
    <div className="min-h-screen flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Channel not found
      </span>
    </div>
  );
};

export default WorkSpaceIdPage;
