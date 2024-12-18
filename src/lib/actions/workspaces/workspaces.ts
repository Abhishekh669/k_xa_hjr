'use server'

import { userDataType } from "@/app/(slack)/slack/workspace/[workspaceId]/page";
import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB"
import { Member } from "@/model/members.model";
import { WorkSpace } from "@/model/workspace.model";
import { WorkSpaceType } from "@/types/workspace";

connectDB();


const generateCode = () =>{
    const code = Array.from(
        {length : 6},
         () =>"0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
    ).join("")

    return code;
}

export const getWorkspaceDetails = async(data : userDataType) =>{

    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    const getWorkSpace = await Member.findOne({userId : data.userId , workspaceId : data.workspaceId}).populate("workspaceId")
console.log("workspace : ",getWorkSpace)
    if(!getWorkSpace) return {
        error : "WorkSpace not found"
    };
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
    if(checkWorkSpace) return {error : "WorkSpace Already Exists"}
    const newData = {...data, joinCode: generateCode()}
    console.log("this is the new data : ", newData)
    const newWorkSpace = await new WorkSpace(newData);
    const savedWorkSpace = await newWorkSpace.save();
    if(!savedWorkSpace){
        return {error : "Failed to created Workspace"}
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
        const members = await Member.find({ userId: userId }).populate('workspaceId');
        const workspaces = members.map((member) =>(member.workspaceId))
    return {
        message : "Successfull fetched workspaces",
        workspaces : JSON.stringify(workspaces)
    }
}