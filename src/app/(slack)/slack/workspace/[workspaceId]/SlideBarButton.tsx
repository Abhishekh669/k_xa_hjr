import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons/lib'

interface SideBarButtonProps {
    icon : LucideIcon | IconType,
    label : string,
    isActive ? : boolean
}

export const SideBarButton = ({
    icon : Icon,
    label,
    isActive
} : SideBarButtonProps) =>{
    return(
        <div className='flex flex-col  items-center justify-center gap-y-0.5 cursor-pointer group'>
                <Button
                    variant="ghost"
                    className={cn("size-9 p-2  rounded-[5px]  bg-none group-hover:bg-white/30", isActive && "bg-white/30")}

                >
                        <Icon className="size-6 text-white group-hover:scale-110 transition-all" />

                </Button>
                <span className='text-[12px] text-white group-hover:text-accent'>{label}</span>
        </div>
    )
}
