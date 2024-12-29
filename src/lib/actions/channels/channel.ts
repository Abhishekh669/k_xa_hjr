"use server"

import { auth } from "@/auth";
import { Channel } from "@/model/channel.model";
import { Member } from "@/model/members.model";
import { parse } from "path";

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


export const createChannel = async(data : {name : string , workspaceId : string}) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    const member = await Member.findOne({workspaceId : data.workspaceId});
    if(!member || member.role !== "admin") throw new Error("Unauthorized")
    const parsedName = data.name.replace(/\s+/g,"-").toLowerCase();
    const newChanelData = {
        ...data,
        name : parsedName
    }

    const newChannel = await  new Channel(newChanelData);
    const saveNewChannel = await newChannel.save();
    if(!saveNewChannel) return {error : "Failed to create channel"}
    return {
        message : "SuccessFully created Channel",
        channel : JSON.stringify(saveNewChannel)
    }

    

}