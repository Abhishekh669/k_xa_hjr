import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { toast } from "sonner";
import { useNewJoinCode } from "@/utils/hooks/mutateHooks/workspace/useNewJoinCode";
import useConfirm from "@/utils/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
  const workspaceId = useWorkSpaceId();
  const [ConfirmDialog,confirm] = useConfirm(
    "Are you sure?",
    "This will deactive the current invite code and generate a new one"
  );

  const { mutate, isPending } = useNewJoinCode();
  const handleNewCode = async() => {
    const ok = await confirm();
    if(!ok) return;
    mutate(workspaceId, {
      onSuccess: (res) => {
        if (res.message && res.updatedWorkspace) {
          toast.success("Invite code regenerated");
        } else {
          toast.error("Failed to regenerate invite code");
        }
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/slack/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };
  return (
    <>
    <ConfirmDialog />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>
            Use the code below to invite people to your workspace
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 items-center justify-center py-10">
          <p className="text-3xl font-bold tracking-widest uppercase">
            {joinCode}
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="hover:bg-gray-200 rounded-[5px]"
            onClick={handleCopy}
          >
            Copy Link
            <CopyIcon className="size-4 ml-2" />
          </Button>
        </div>
        <div className="flex items-center justify-between w-full">
          <Button
            className="hover:bg-gray-200 rounded-[5px]"
            onClick={handleNewCode}
            disabled={isPending}
          >
            New Code
            <RefreshCcw className="size-4 ml-4" />
          </Button>
          <DialogClose asChild>
            <Button className="bg-black  text-white  hover:bg-black rounded-[5px]">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

export default InviteModal;
