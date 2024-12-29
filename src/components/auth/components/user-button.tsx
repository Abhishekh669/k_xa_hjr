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
import { useGetLoggedInUser } from "@/utils/hooks/queryHooks/user/useGetLogedInUser"



export const UserButton = () => {
    const session = useGetLoggedInUser();
    return (
        <DropdownMenu
            modal={false}
        >
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition text-white rounded-[5px] bg-blue-500">
                    <AvatarImage alt="img" src={session?.data?.image}/>
                    <AvatarFallback className="rounded-[5px]">
                            {session?.data?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side='right' className="w-60  text-black rounded-[5px]">
                <DropdownMenuItem className="">
                    <Logout />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}