"use client"
import { UserButton } from '@/components/auth/components/user-button'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'
import { useGetAllWorkSpaces } from '@/utils/hooks/queryHooks/workspace/useGetAllWorkSpaces';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'

function HomePage() {
    const [open, setOpen] = useCreateWorkspaceModal();
    const session = useSession();
    const router = useRouter();
    const {data, isLoading, error} = useGetAllWorkSpaces(session?.data?.user._id as string);
    const workSpaceId = useMemo(() => data?.workspaces[0]?._id, [data])
    useEffect(()=>{
        if(isLoading) return;
        if(workSpaceId){
            router.replace(`/slack/workspace/${workSpaceId}`)
        }else if (!open){
            setOpen(true)
        }
    },[data, isLoading, open, setOpen, router])
  return (
    <div className='w-full h-full'>
        <UserButton />
    </div>
  )
}

export default HomePage
