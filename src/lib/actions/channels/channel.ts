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
    const existingChannel = await Channel.findOne({
        $and : [
            {name : data.name},
            {workspaceId : data.workspaceId}
        ]     
    })
    if(existingChannel){
        return {error : "Channel already exists"}
    }
    const member = await Member.findOne({workspaceId : data.workspaceId});
    console.log("this is hte member : ",member)
    if(!member || member.role !== "admin") {
        console.log("i am error")
        throw new Error("Unauthorized")
    }
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

export const getChannelById = async(channelId : string) =>{
    const session = await auth();
    if(!session?.user) return null;
    const channel = await Channel.findById({_id : channelId})
    if(!channel){
        return null
    }
    const member = await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId : channel?.workspaceId}
        ]
    }) 
    if(!member){
        return null;
    }

    return {
        message : "Got channel",
        channel : JSON.stringify(channel)
    }
}
interface UpdateChannelProps{
    channelId : string ,
    name : string 
}

export const updateChannel = async({channelId,  name}: UpdateChannelProps)=>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const channel = await Channel.findOne({_id : channelId})
    if(!channel){
        throw new Error("No channel found");
    }

    const member = await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId : channel?.workspaceId}
        ]
    }) 
    if(!member || member.role !== "admin"){
        throw new Error("Unauthorized")
    }
    const existingChannel = await Channel.findOne({
        $and : [
            {name},
            {workspaceId : channel.workspaceId}
        ]     
    })
    if(existingChannel){
        return {error : "Channel already exists"}
    }
    const updateChannel = await Channel.findByIdAndUpdate({_id : channelId}, {name : name}, { new : true}) 
    if(!updateChannel){
        return {
            error : "Failed to update the channel"
        }
    }

    return {
        message  :"SuccessFully updated",
        updatedChannel : JSON.stringify(updateChannel)
    }
    

}


export const deleteChannel = async(channelId : string)=>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const channel = await Channel.findOne({_id : channelId})
    if(!channel){
        throw new Error("No channel found");
    }
    const member = await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId : channel?.workspaceId}
        ]
    }) 
    if(!member || member.role !== "admin"){
        throw new Error("Unauthorized")
    }
    const deleteChannel = await Channel.findByIdAndDelete({_id : channelId})
    if(!deleteChannel)return {error : "WorkSpace not found or could not be deleted"}
    return {
        message  :"SuccessFully Deleted",
        deleteChannel : JSON.stringify(deleteChannel)
    }
}