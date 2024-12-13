'use server'

import { userDataType } from "@/app/(slack)/slack/workspace/[workspaceId]/page";
import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB"
import { Member } from "@/model/members.model";
import { WorkSpace } from "@/model/workspace.model";
import { WorkSpaceType } from "@/types/workspace";

connectDB();

export const getWorkspaceDetails = async(data : userDataType) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    const getWorkSpace = await WorkSpace.findOne({userId : data.userId, _id : data.workspaceId})
    if(!getWorkSpace) throw new Error("WorkSpace not found")
    return {
        message : "WorkSpace found Successfully",
        workspace : JSON.stringify(getWorkSpace)
    }
}


export const createWorkSpace = async(data : WorkSpaceType) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    const checkWorkSpace = await WorkSpace.findOne({
            $and: [
                { userId: data.userId },
                { name : data.name},
              ],
    })
    if(checkWorkSpace) throw new Error("WorkSpace already exists")
    const newWorkSpace = await new WorkSpace(data);
    const savedWorkSpace = await newWorkSpace.save();
    if(!savedWorkSpace){
        throw new Error("Failed to create the workspaces")
    }
    const newMember = await  new Member({
        userId : data.userId,
        workspaceId  : savedWorkSpace._id,
        role : "admin"
    })

    await newMember.save();
    
    return {
        message : "Successfully created workspaces",
        workspace : JSON.stringify(savedWorkSpace)
    }
}




export const getAllWorkSpaces = async(userId : string) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    try {
        const workspaces = await WorkSpace.find({userId });
    return {
        message : "Successfull fetched workspaces",
        workspaces : JSON.stringify(workspaces)
    }
    } catch (error) {
        throw new Error("Something went wrong.")
        
    }
    
    
}