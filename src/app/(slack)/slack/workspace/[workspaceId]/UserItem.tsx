import React from 'react'
import { Button } from '@/components/ui/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useWorkSpaceId } from '@/utils/hooks/workSpaceHook/use-workspace-id'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const userItemVariant = cva(
    "flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/20  rounded-[5px] justify-center justify-start font-normal h-7 px-[18px] text-sm overflow-hidden ",
    {
        variants : {
            variant : {
                default : "",
                active : " bg-white/50 hover:bg-white/50 "
            }
        },
        defaultVariants : {
            variant : "default"
        }
    },
    
)

interface UserItemProps{
    id : string,
    label?: string,
    image?: string,
    variant?:VariantProps<typeof userItemVariant>["variant"],
}



function UserItem({
    id,
    label ="Member",
    image,
    variant
} : UserItemProps) {
    const workspaceId = useWorkSpaceId();
    const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button
        variant="ghost"
        className={cn(
            userItemVariant({variant: variant})
        )}
        size={"sm"}
        asChild
    >
         <Link href={`/slack/workspace/${workspaceId}/member/${id}`}>
            <Avatar className='size-5 rounded-[5px] mr-1 bg-blue-500'>
                <AvatarImage className='rounded-md ' src={image}/>
                <AvatarFallback className='rounded-md text-md font-semibold'>
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className='text-sm truncate'>{label}</span>
         </Link>       
    </Button>
  )
}

export default UserItem
