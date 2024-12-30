"use server"

import { auth } from "@/auth"
import { Member } from "@/model/members.model";

export interface memberType{
    userId : string,
    workspaceId : string
}

export const currentMember = async(data  : memberType) =>{
    const session = await auth();
    if(!session) throw new Error("authorized");
    const member = await Member.findOne({
        userId : data.userId, workspaceId : data.workspaceId
    }).populate("userId").populate("workspaceId")
    if(!member) return {error : "No any members"}
    return {
        message : "SuccessFully got current member",
        member : JSON.stringify(member)
    }
}