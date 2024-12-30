'use server'

import { userDataType } from "@/app/(slack)/slack/workspace/[workspaceId]/page";
import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB"
import { Channel } from "@/model/channel.model";
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

    const newChannel = await new Channel({
        name : "general",
        workspaceId : savedWorkSpace._id
    })

    await newChannel.save();
    
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

export const updateWorkSpace = async(data : {userId : string, workspaceId : string, newName: string}) =>{
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




export const deleteWorkSpace = async(data : {userId : string, workspaceId : string }) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const members = await Member.find({ workspaceId : data.workspaceId});
    if(members.length < 0) throw new Error("No any worksapces available")
    const isAdmin = members.some(member => member.userId == data.userId && member.role == "admin");
    if(!isAdmin) throw new Error("Unauthorized")
    const deleteMember = await Member.deleteMany({workspaceId : data.workspaceId});
    const deleteChannel = await Channel.deleteMany({workspaceId : data.workspaceId})
    const deleteWorkspace = await WorkSpace.findByIdAndDelete({_id : data.workspaceId})
    if(!deleteWorkspace)return {error : "WorkSpace not found or could not be deleted"}
    return {
        message : "SuccessFully deleted ",
        workspace : deleteWorkspace
    }

}

export const getWorkspaceMembers = async(workspaceId : string ) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const members = await Member.find({workspaceId}).populate("userId");
    if(!members) return {error : "No members found"};
    return { 
        message : "SuccessFully Fetched Members",
        members : JSON.stringify(members)
    }
}



export const getNewJoinCode = async(workspaceId: string ) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const member = await Member.findOne({
        $and : [
                { userId: session?.user?._id},
                {workspaceId},
        ]
    })
    if(!member || member.role !== "admin"){
        throw new Error("Unauthorized")
    }

    const joinCode = generateCode();
    const updatedWorkSpace = await WorkSpace.updateOne(
        { _id: workspaceId },
        { $set: { joinCode} } // Add a timestamp if needed
    );

    if(!updatedWorkSpace) return {error  : "Failed to create new code"}
    return {message : "SuccessFully created the new code ", updatedWorkspace : updatedWorkSpace}


}


export const JoinWorkspace = async(data : {joinCode : string, workspaceId : string }) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized");
    const workspace = await WorkSpace.findById({_id : data.workspaceId})
    if(!workspace){
        throw new Error("Workspace not found")
    }
    if(workspace.joinCode !== data.joinCode.toLocaleLowerCase() ){
        throw new Error("Invalid Join Code")
    }
    const existingMember = await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId : data.workspaceId}
        ]
    })
    if(existingMember){
        throw new Error("Already an active member of this workspace")
    }
    const newMember = await new Member({
        userId : session?.user?._id,
        workspaceId : workspace._id,
        role : "member"
    })
    const savedMember = await newMember.save();
    if(!savedMember) return {error : "Failed to add user"}
    return {message : "SuccessFully added User", member : JSON.stringify(savedMember)}
}


export const getInfoById = async(workspaceId : string) =>{
    const session = await auth();
    if(!session?.user) return null;
    const member= await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId }
        ]
    })

    const workspace = await WorkSpace.findOne({_id : workspaceId})
    const data = { name : workspace?.name,
        isMember : !!member
    }
    return {
        message : "Found Something",
        info : JSON.stringify(data)
    }
    

}