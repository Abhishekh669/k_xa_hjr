"use client"
import { Button } from '@/components/ui/button'
import { useGetLoggedInUser } from '@/utils/hooks/queryHooks/user/useGetLogedInUser'
import { useGetAllWorkSpaces } from '@/utils/hooks/queryHooks/workspace/useGetAllWorkSpaces'
import { Info, Search } from 'lucide-react'
import React from 'react'
import { userDataType } from './page'
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id'
import { useGetWorkspaceDetails } from '@/utils/hooks/queryHooks/workspace/useGetWorkspaces'

function Toolbar() {
    const {data, isError, isLoading} = useGetLoggedInUser();
    const workspaceId = useWorkSpaceId();
    const userData:userDataType = {
        userId : data?._id as string,
        workspaceId
      }
      const {data: workspace, isError : workspaceError, isLoading: workspaceIsLoading} = useGetWorkspaceDetails(userData);
  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5 '>
        <div className='flex-1' />
        <div className='min-w-[280px] max-[642px] grow-[2] shrink rounded-sm' >
                <Button size="sm" className="bg-accent-25 bg-[rgb(109,22,110)] hover:bg-[rgb(164,34,167)] w-full jusitfy-start  px-2 rounded-sm">
                <Search  className='size-4 text-white mr-2'/>
                <span className="text-white text-xs">
                    Search {data?.name}'s workspace
                </span>
            </Button>
        </div>
        <div className='ml-auto flex-1 flex items-center justify-end'>
            <Button variant="ghost" size="iconSm" className='hover:bg-transparent'>
                <Info className='size-5 hover:text-white'  />
            </Button>
        </div>
      
    </nav>
  )
}

export default Toolbar