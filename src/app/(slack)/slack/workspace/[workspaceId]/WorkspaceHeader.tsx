import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WorkSpaceType } from "@/types/workspace";
import { MemberType } from "@/types/member.type";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import Hint from "@/components/Hint";

function WorkspaceHeader({
  workspace,
  isAdmin,
}: {
  workspace: MemberType;
  isAdmin: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="font-semibold text-lg text-white  w-auto p-1.5 overflow-hidden hover:bg-white/30 hover:text-white rounded-[5px]"
          >
            <span className="truncate">{workspace?.workspaceId?.name}</span>
            <ChevronDown className="size-4  shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          className="w-64 bg-white rounded-[5px] hover:text-black hover:bg-white text-black "
        >
          <DropdownMenuItem className="cursor-pointer capitalize ">
            <div className="size-9 relative overflow-hidden bg-[#616061]   text-white font-semibold text-xl rounded-[5px] flex items-center justify-center mr-2">
              {workspace.workspaceId.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start text-black">
              <p className="font-bold">{workspace.workspaceId.name}</p>
              <p className=" text-muted-foreground">Active Workspace</p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator className="text-black h-1" />
              <DropdownMenuItem
                className="cursor-pointer py-2 text-black  "
                onClick={() => {}}
              >
                Invite poeple to {workspace.workspaceId.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer py-2 text-black  "
                onClick={() => {}}
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint label="Filter Conversation" side="bottom">
          <Button
            variant="ghost"
            className="hover:bg-white/30 rounded-[5px]"
            size={"sm"}
          >
            <ListFilter className="size-4 text-white " />
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button
            variant="ghost"
            className="hover:bg-white/30 rounded-[5px]"
            size={"sm"}
          >
            <SquarePen className="size-4 text-white " />
          </Button>
        </Hint>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
