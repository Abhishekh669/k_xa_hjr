import { ObjectId } from "mongoose";

export interface WorkSpaceType{
    name : string, 
    _id ? : string,
    userId : ObjectId,
    joinCode : string
}