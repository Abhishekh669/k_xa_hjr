import { ObjectId } from "mongoose";
import { WorkSpaceType } from "./workspace";

export interface MemberType{
    role : string,
    userId : string,
    workspaceId : WorkSpaceType,
    _id : ObjectId
}