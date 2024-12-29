"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkSpace } from "@/utils/hooks/mutateHooks/workspace/useCreateWorkSpace";
import { useState } from "react";
import { useGetAllWorkSpaces } from "@/utils/hooks/queryHooks/workspace/useGetAllWorkSpaces";
import { TriangleAlert } from "lucide-react";
import {  useRouter } from "next/navigation";
import { WorkSpaceType } from "@/types/workspace";
import { User } from "next-auth";
import { toast } from "sonner";

export const CreateWorkspaceModal = ({user} : {user : User}) => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const [error, setError] = useState("")
  const router = useRouter();


  const { data, mutate: server_create_workspace,isPending } = useCreateWorkSpace();
  const {data: workspaces, isError, isLoading} = useGetAllWorkSpaces(user?._id as string)

  const createWorkSpace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")
    if(name.length > 0){
      if (user) {
        const workSpaceDetails = {
          name: name,
          userId: user._id as Object,
          joinCode: "",
        };
        server_create_workspace(workSpaceDetails as WorkSpaceType,{
          onSuccess : (response) =>{
              if(response.message && response.workspace){
              toast.success(response.message)
              const res : WorkSpaceType = JSON.parse(response.workspace)
              handleClose();
              router.push(`/slack/workspace/${res?._id}`)
            }
            else if (response.error){
              toast.error(response.error)
            }
          }
        });
        
      }
    }else{
      setError("Name is required")
    }
  };
  const handleClose = () => {
    setOpen(false);
    setName("")
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add WorkSpace</DialogTitle>
        </DialogHeader>
          {error && (<span className=" flex gap-x-4 text-[10px] text-red-600"><TriangleAlert className="text-red-600" /><span   >{error}</span></span>)}
        <div>
        <form onSubmit={createWorkSpace} className="space-y-2">
            <Input   className="" placeholder="Add WorkSpace eg: Home" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading}/>
            <Button type="submit" className="bg-white hover:bg-white text-black"  disabled={isLoading}>Create</Button>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
