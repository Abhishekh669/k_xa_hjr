"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useJoinWorkspace } from "@/utils/hooks/mutateHooks/workspace/useJoinWorkspace";
import { useGetInfoById } from "@/utils/hooks/queryHooks/workspace/useGetInfoById";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input"
import { toast } from "sonner";

export default function JoinPage() {
  const workspaceId = useWorkSpaceId();
  const router= useRouter();
  const {data , isLoading} = useGetInfoById(workspaceId);

  const { mutate, isPending} = useJoinWorkspace();
  const isMember = useMemo(()=>data?.info?.isMember,[data?.info?.isMember])
  useEffect(()=>{
    if(isMember){
      router.push(`/slack/workspace/${workspaceId}`)
    }
  },[isMember, router, workspaceId])
  const handleComplete = (value : string) =>{
    mutate({joinCode : value, workspaceId},{
      onSuccess : (res) =>{
        if(res.message && res.member){
          const workspaceDetails = JSON.parse(res.member)
          router.push(`/slack/workspace/${workspaceDetails.workspaceId}`)
          toast.success("Workspaces joined ")
        }else{
          toast.error("Failed to join workspace")
        }
      },
      onError : (error) =>{
        toast.error(error.message || "Something went wrong")
      }
    })

  }
  if(isLoading) {
    return (
      <div className=" bg-white min-h-screen h-full flex items-center justify-center">
        <Loader className="size-6  animate-spin text-muted-foreground" />
      </div>
    )
  }
  return (
    <div className="min-h-screen h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image src="/logo.jpg" width={60} height={60} alt="logo" className="rounded-full w-12 h-12"/>
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl text-black font-bold">Join {data?.info?.name as string}</h1>
          <p className="text-md text-muted-foreground">
            Enter the worksapce code to join
          </p>
        </div>
        <VerificationInput 
        onComplete={handleComplete}
        length={6}
          classNames={{
            container : cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed "),
            character : "uppercase h-auto rounded-[5px] border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-gray-200",
            characterSelected : "bg-white text-black",
            characterFilled : "bg-white text-black"
          }}
          autoFocus
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg"  className="rounded-[5px] outline-none bg-gray-200 hover:bg-gray-300 text-black" asChild>
              <Link href={"/"}>Back to home</Link>
        </Button>

      </div>
    </div>
  );
}
