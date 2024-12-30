import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/utils/hooks/channelHook/use-channel-id";
import { useDeleteChannel } from "@/utils/hooks/mutateHooks/channels/useDeleteChannel";
import { useUpdateChannel } from "@/utils/hooks/mutateHooks/channels/useUpdateChannel";
import { useGetCurrentMember } from "@/utils/hooks/queryHooks/member/useCurrentMember";
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser";
import useConfirm from "@/utils/hooks/use-confirm";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { DialogClose } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps {
  name: string;
}
function Header({ name }: HeaderProps) {
  const channelId = useChannelId();
  const {data : userData} = useGetLoggedInUser();
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(name);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this Channel ?",
    "You are about to delete the channel. This action is irreversible"
  );
  const {data : member} =useGetCurrentMember({
    userId : userData?._id as string ,
    workspaceId 
  });

  const handleEditOpen = (value : boolean) =>{
    if(member?.member?.role !=="admin") return;
    setEditOpen(true)

  }
  const {mutate:update_channel, isPending:updatePending} = useUpdateChannel();
  const {mutate:delete_channel, isPending:deletePending} = useDeleteChannel();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    update_channel({channelId, name: value},{
        onSuccess : (res) =>{
            if(res.message && res.updatedChannel){
                console.log("this is message : ",res)
                toast.success(res.message)
                setEditOpen(false)
            }else{
                toast.error(res.error)
            }
        }, onError : (err) =>{
            toast.error(err.message || "Something went wrong")
        }
    })
  }

  const handleDelete = async() =>{
    const ok = await confirm();
    if(!ok) return;
    delete_channel(channelId,{
        onSuccess : (res) =>{
            if(res.message && res.deleteChannel){
                toast.success(res.message)
                router.push(`/slack/workspace/${workspaceId}`)
            }
            else if(res.error){
                toast.error(res.error as string)
            }

        },
        onError : (err) =>{
            toast.error( err.message || "Something went wrong")
        }

    })
  }

  return (
    <div className="bg-white border-b rounded-[3px] h-[49px] w-auto  flex item-center px-4 overflow-hidden">
        <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-lg  text-black hover:bg-gray-200 hover:text-black rounded-[5px] font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {name}</span>
            <FaChevronDown className="size-5 ml-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {name}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2 ">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white  border cursor-pointer hover:bg-gray-50 rounded-[10px]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name : </p>
                   {member?.member?.role === "admin" && 
                   (
                    <p className="text-sm text-[#126483 hover:underline font-semibold">
                    Edit
                  </p>
                   )}
                  </div>
                  <p className="text-sm"># {name}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={updatePending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="eg: plan-budget"
                    className="rounded-[5px]"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={updatePending}
                        className="rounded-[5px] border-none hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={updatePending}
                      className="bg-black hover:bg-black text-white hover:text-white rounded-[5px]"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
           {member?.member?.role === "admin" && (
             <button  onClick={handleDelete} disabled={deletePending} className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-[10px] cursor-pointer border hover:bg-gray-100 text-rose-600">
             <TrashIcon className="size-4" />
             <p className="text-sm font-semibold">Delete channel</p>
           </button>
           )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
