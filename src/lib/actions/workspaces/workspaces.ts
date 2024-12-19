'use server'

import { userDataType } from "@/app/(slack)/slack/workspace/[workspaceId]/page";
import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB"
import { Member } from "@/model/members.model";
import { WorkSpace } from "@/model/workspace.model";
import { WorkSpaceType } from "@/types/workspace";
import { workerData } from "worker_threads";

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

export const updateWorkSpace = async(data : any) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const members = await Member.findOne(
        {
            $and: [
                { userId: data.userId },
                { workspaceId : data.workspaceId},
              ],
        }
    ).populate("workspaceId");
    if(!members || members.role !== "admin"){
            throw new Error("Unauthroized")
    }
    const updatedData = await WorkSpace.findByIdAndUpdate({_id : members.workspaceId._id}, {name : data.newName}, { new : true})

    if(!updatedData){
        return {
            error : "Failed to Update"
        }
    }
    return {
        message : "SuccessFully updated",
        workspace : JSON.stringify(updatedData)
    }

}


export const deleteWorkSpace = async(data : any) =>{
    console.log("this is hte data in delete : ",data)
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const members = await Member.find({ workspaceId : data.workspaceId});
    console.log("this is the members from the delete : ",members)
    if(members.length < 0) throw new Error("No any worksapces available")
    const isAdmin = members.some(member => member.userId == data.userId && member.role == "admin");
console.log("This is hte admin check ", isAdmin)
    if(!isAdmin) throw new Error("Unauthorized")
    const deleteMember = await Member.deleteMany({workspaceId : data.workspaceId});
    const deleteWorkspace = await WorkSpace.findByIdAndDelete({_id : data.workspaceId})
    if(!deleteWorkspace)return {error : "WorkSpace not found or could not be deleted"}
    return {
        message : "SuccessFully deleted ",
        workspace : JSON.stringify(deleteWorkspace)
    }

}