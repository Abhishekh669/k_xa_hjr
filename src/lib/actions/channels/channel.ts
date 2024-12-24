"use server"

import { auth } from "@/auth";
import { Channel } from "@/model/channel.model";
import { Member } from "@/model/members.model";

export const getChannel = async(workspaceId : string)  =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    
    const member = await Member.findOne({
        $and: [
            { userId: session?.user._id},
            { workspaceId : workspaceId},
          ],
    }).populate("workspaceId")
    if(!member){
        return {
            error : "No any members found"
        }
    }
    const channels = await Channel.find({workspaceId})
    if(!channels){
        return {
            error : "No any channel found"
        }
    }
    return {
        message : "Found Channel SuccessFully",
        channels : JSON.stringify(channels)
    }
        
}