"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkSpace } from "@/utils/hooks/mutateHooks/workspace/useUpdateWorkSpace";
import { useDeleteWorkSpace } from "@/utils/hooks/mutateHooks/workspace/useDeleteWorkSpace";
import { Input } from "@/components/ui/input";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useConfirm from "@/utils/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
function PreferencesModal({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const { data: userData } = useGetLoggedInUser();
  const {
    data: updatedData,
    mutate: updateWorkSpace,
    isPending: updatePending,
  } = useUpdateWorkSpace();
  const {
    data: deletedData,
    mutate: deleteData,
    isPending: deletePending,
  } = useDeleteWorkSpace();
  const handleDelete = async () => {
    const data = {
      userId: userData?._id as string ,
      workspaceId,
    };
    const ok = await confirm();
    if(!ok) return;

    deleteData(data, {
      onSuccess: (res) => {
        if (res.message && res.workspace) {
          toast.success(res.message);
          console.log("i am deleted")
          router.push("/");
        } else if (res.error) {
          toast.error(res.error);
        }
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      userId: userData?._id as string ,
      workspaceId,
      newName: value,
    };

    

    updateWorkSpace(data , {
      onSuccess: (res) => {
        if (res.message && res.workspace) {
          toast.success(res.message);
          setEditOpen(false);
        } else if (res.error) {
          toast.error(res.error);
        }
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };
  console.log("this is the data after deleteing : ",deleteData)
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 text-black overflow-hidden rounded-[10px] ">
          <DialogHeader className="p-4 border-b bg-white ">
            <DialogTitle className="">{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className='"text-sm font-semibold'>Workspace name</p>
                    <p className="text-sm text-[#0c4e81] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white text-black rounded-[5px]">
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    className="rounded-[5px]"
                    value={value}
                    disabled={updatePending}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'work', 'perosnal' "
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={updatePending}
                        className="rounded-[5px]"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={updatePending}
                      className="rounded-[5px] bg-black text-white hover:bg-black/200 hover:text-white"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={deletePending}
              onClick={handleDelete}
              className="flex  items-center gap-x-2 px-4 py-5 rounded-lg border cursor-pointer hover:bg-gray-100 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PreferencesModal;
