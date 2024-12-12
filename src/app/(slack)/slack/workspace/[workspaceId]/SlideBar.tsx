import { UserButton } from '@/components/auth/components/user-button'
import React from 'react'
import WorkSpaceSwitcher from './WorkSpaceSwitcher'

function SlideBar() {
  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4 '>
        <WorkSpaceSwitcher />
        <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
            <UserButton />
        </div>
    </aside>
  )
}

export default SlideBar
