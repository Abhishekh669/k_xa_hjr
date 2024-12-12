"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Logout from "@/components/users/Logout"
import { useSession } from "next-auth/react"



export const UserButton = () => {
    const session = useSession();
    return (
        <DropdownMenu
            modal={false}
        >
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition bg-green-600">
                    <AvatarImage alt="img" src={session?.data?.user.image}/>
                    <AvatarFallback>
                            {session?.data?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side='right' className="w-60">
                <DropdownMenuItem className="">
                    <Logout />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}