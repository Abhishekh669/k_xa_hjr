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
import { useSession } from "next-auth/react";
import { useCreateWorkSpace } from "@/utils/hooks/mutateHooks/useCreateWorkSpace";
import { useState } from "react";
import { useGetAllWorkSpaces } from "@/utils/hooks/queryHooks/workspace/useGetAllWorkSpaces";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { WorkSpaceType } from "@/types/workspace";
import { User } from "next-auth";

export const CreateWorkspaceModal = ({user} : {user : User}) => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const [error, setError] = useState("")
  const [createdWorkSpace, setCreatedWorkSpace] = useState<WorkSpaceType>()
  const router = useRouter();


  const { data, mutate: server_create_workspace, } = useCreateWorkSpace();
  const {data: workspaces, isError, isLoading} = useGetAllWorkSpaces(user?._id as string)

  const createWorkSpace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("")
    if(name.length > 0){
      if (user) {
        const workSpaceDetails = {
          name: name,
          userId: user._id as string,
          joinCode: "123456",
        };
        server_create_workspace(workSpaceDetails as WorkSpaceType,{
          onSuccess : (response) =>{
            setCreatedWorkSpace(JSON.parse(response.workspace))
            if(response.message){
              router.push(`/slack/workspace/${createdWorkSpace?._id}`)
              handleClose();
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
            <Input disabled={isLoading}  className="" placeholder="Add WorkSpace eg: Home" value={name} onChange={(e) => setName(e.target.value)}/>
            <Button type="submit" className="bg-white hover:bg-white text-black">Create</Button>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
