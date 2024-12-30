import React, { useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

import { useCreateChannelModal } from '../store/use-create-channel-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateChannel } from '@/utils/hooks/mutateHooks/channels/useCreateChannel';
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


function CreateChannelModal() {
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("")
    const {mutate : server_createChannel, isPending} = useCreateChannel();
    const workspaceId  = useWorkSpaceId();
    const router = useRouter()
    
    const handleClose = () =>{
        setName("")
        setOpen(false)
    }

    const handleChange  = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value.replace(/\s+/g,"-").toLowerCase();
        setName(value)
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) =>{
            e.preventDefault();
            server_createChannel({
                name, workspaceId
            },{
                onSuccess : (res) =>{
                    //todo  redirect to new channel
                    if(res.message && res.channel){
                        const data = JSON.parse(res.channel)
                        toast.success("SuccessFully created new Channel")
                        router.push(`/slack/workspace/${workspaceId}/channel/${data._id}`)
                        handleClose();
                    }else{
                        toast.error("Failed to create a channel")
                    }
                },
                onError : (error) =>{
                    toast.error(error.message || "Something went wrong")
                }
            },)
    }


  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className='rounded-[5px]'>
            <DialogHeader className='rounded-[5px]'>
                <DialogTitle>Add a channel</DialogTitle>
            </DialogHeader>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <Input
                    className='rounded-[5px]'
                    value={name}
                    disabled={false}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={40}
                    placeholder='eg : plan-budget'
                />
                <div className='flex justify-end'>
                    <Button  disabled={isPending} className='bg-black text-white rounded-[5px] hover:bg-black'>
                            Create
                    </Button>
                </div>
            </form>
        </DialogContent>

    </Dialog>
  )
}

export default CreateChannelModal
