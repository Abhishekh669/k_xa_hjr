"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { WorkSpaceType } from "@/types/workspace";
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser";
import { useGetAllWorkSpaces } from "@/utils/hooks/queryHooks/workspace/useGetAllWorkSpaces";
import { useGetWorkspaceDetails } from "@/utils/hooks/queryHooks/workspace/useGetWorkspaces";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { AlertCircle, Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function WorkSpaceSwitcher() {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModal();
  const { data: user } = useGetLoggedInUser();
  const { data: workspaces, isLoading: workspacesLoading } =
    useGetAllWorkSpaces(user?._id as string);
  const { data: workspace, isLoading: workspaceLoading } =
    useGetWorkspaceDetails({ userId: user?._id as string, workspaceId });
  const filterWorkspaces = workspaces?.workspaces?.filter(
    (workspace: WorkSpaceType) => workspace?._id   !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9  justify-center relative overflow-hidden rounded-[5px] bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            <span>{workspace?.workspace?.name.charAt(0).toUpperCase()}</span>
          ) }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 bg-white flex flex-col"
      >
        <DropdownMenuItem
          className=" window-switch  text-black cursor-pointer flex-col justify-start items-start capitalize  dropdown-hover:bg-red-600 z-10 "
          onClick={() => router.push(`/slack/workspace/${workspaceId}`)}
        >
          <div className="text-[20px] font-semibold">
            {workspace?.workspace.name}
          </div>
          <span className="text-xs ">Active Workspace</span>
        </DropdownMenuItem>

        <div className=" max-h-[calc(95vh-200px)] overflow-y-auto">
        {filterWorkspaces?.map((workspace: WorkSpaceType) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer capitalize overflow-hidden text-black border-[1.5px] border-gray-300  "
            onClick={() => router.push(`/slack/workspace/${workspace._id}`)}
          >
            <div className=" shrink-0 size-9 relative overflow-hidden   text-slate-800 font-semibold rounded-md flex items-center justify-center mr-2  text-lg bg-gray-500">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">
            {workspace.name}
            </p>
          </DropdownMenuItem>
        ))}
        </div>
        <DropdownMenuItem
          className="cursor-pointer border-2 border-gray-400 rounded-md text-black hover:bg-[#c6c5c5]"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden   text-slate-800 font-semibold rounded-md flex items-center justify-center mr-2  text-lg">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkSpaceSwitcher;
