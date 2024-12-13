import { UserButton } from '@/components/auth/components/user-button'
import React from 'react'
import WorkSpaceSwitcher from './WorkSpaceSwitcher'
import { SideBarButton } from './SlideBarButton'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

function SlideBar() {
  const pathname=usePathname();
  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4 '>
        <WorkSpaceSwitcher />
        <SideBarButton icon={Home} label="Home" isActive={pathname.includes("workspace")}/>
        <SideBarButton icon={MessagesSquare} label="DMs" />
        <SideBarButton icon={Bell} label="Activity" />
        <SideBarButton icon={MoreHorizontal} label="More" />
        <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
            <UserButton />
        </div>
    </aside>
  )
}

export default SlideBar
