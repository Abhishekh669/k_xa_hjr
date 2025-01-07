"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB";
import { Member } from "@/model/members.model";
import { Message } from "@/model/messages.model";
import { Reaction } from "@/model/reaction.model";
import { Storage } from "@/model/storage.model";
import { User } from "@/model/user.model";

connectDB();
interface MessageType {
  body: string;
  image?: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?:string;
  
  //todo : add conversation Id
}

//handle conversationId

export const createMessage = async(data: MessageType) => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const member = await Member.findOne({
        $and : [
            {userId : session?.user?._id},
            {workspaceId : data.workspaceId}
        ]
  }).populate('workspaceId').populate('userId');
  console.log("this is the memebrs in the message : ",member);
  if(!member){
    throw new Error("Unauthorized");
  };
 
  let _conversationId = data.conversationId;
 //only possible if we are replying in a thread in 1:1 conversation
  if(!data.conversationId && !data.channelId && data.parentMessageId){
      const parentMessage = await Message.findOne({_id: data.parentMessageId});
      if(!parentMessage){
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;

  }

  const message = await new Message({...data, memberId:member?._id, conversationId : _conversationId});
  const saved_message = await message.save();
  if(!saved_message){
    //delete the image from uploadthing
    return {error : "Failed to create a message"}
  };



  console.log("this is hte saveed_message : ",saved_message)
  
  return {
    message : "SuccessFully created message",
    sent_message : JSON.stringify(saved_message)
  };
  
};



export const populate_user = async (userId : string) =>{
  return await User.findOne({_id : userId});
}

export const populate_member = async(memberId : string) =>{
  return await Member.findOne({_id : memberId});   
}

export const populate_reactions = async(messageId : string) =>{
  return await Reaction.find({messageId});
}

export const populate_thread = async(messageId : string) =>{
  const messages = await Message.find({parentMessageId : messageId});
  if(messages.length ==0){
    return {count : 0,image:undefined,timestamp:0}
  }
  const last_message  = messages[messageId.length -2 ];
  const last_message_member = await populate_member(last_message.memberId);
  if(!last_message_member){
    return {
      count : messages.length,
      image : undefined,
      timestamp :0
    }
  }
  const last_message_user = await populate_user(last_message_member.memberId);
  return {
    count : messages.length,
    image: last_message_user?.image,
    timestamp : last_message._createTime,
  }
}



type GetMessageType = {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
  paginationOpts?: {
    page: number;
    limit: number;
  };
};

export const get_message = async (data: GetMessageType) => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  let _conversationId = data.conversationId;
  if (!data.conversationId && !data.channelId && data.parentMessageId) {
    const parent_message = await Message.findOne({ _id: data.parentMessageId });
    if (!parent_message) {
      throw new Error("Parent message not found");
    }
    _conversationId = parent_message.conversationId;
  }

  const query = {
    $and: [
      data.channelId ? { channelId: data.channelId } : {},
      data.parentMessageId ? { parentMessageId: data.parentMessageId } : {},
      _conversationId ? { conversationId: _conversationId } : {},
    ].filter((condition) => Object.keys(condition).length > 0),
  };

  const page = data.paginationOpts?.page || 1;
  const limit = data.paginationOpts?.limit || 10;
  const skip = (page - 1) * limit;

  const results = await Message.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments(query);
  const data_to_send = await Promise.all(
    results.map(async (message) => {
      const member = await populate_member(message.memberId);
      const user = member ? await populate_user(member.userId) : null;

      if (!member || !user) {
        return null;
      }

      const reactions = await populate_reactions(message._id);
      const thread = await populate_thread(message._id);
      const image = message.image ? await Storage.findOne({ _id: message.image }) : undefined;

      const reactionWithCount = reactions.map((reaction: any) => ({
        ...reaction,
        count: reactions.filter((r: any) => r.value === reaction.value).length,
      }));

      const dedupedReactions = reactionWithCount.reduce(
        (acc: any[], reaction: any) => {
          const existingReaction = acc.find((r) => r.value === reaction.value);
          if (existingReaction) {
            existingReaction.memberIds = Array.from(
              new Set([...existingReaction.memberIds, reaction.memberId])
            );
          } else {
            acc.push({ ...reaction, memberIds: [reaction.memberId] });
          }
          return acc;
        },
        []
      );

      const reactionsWithoutMembersIdProperty = dedupedReactions.map(
        ({ memberId, ...rest }) => rest
      );

      return {
        ...message,
        image,
        member,
        user,
        reactions: reactionsWithoutMembersIdProperty,
        threadCount: thread.count,
        threadImage: thread.image,
        threadTimestamp: thread.timestamp,
      };
    }).filter((message): message is NonNullable<typeof message> => message !== null),
  );
  return {
    message: "Successfully fetched results",
    results: JSON.stringify(data_to_send),
    pagination: JSON.stringify({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }),
  };
};

// type get_message_type = {
//   channelId ?: string,
//   conversationId ?: string,
//   parentMessageId ?: string,
//   paginationOpts?: {
//     page: number; 
//     limit: number;
//   };
// }

// export const get_message = async(data : get_message_type) =>{
//    const session = await auth();
//    if(!session?.user) throw new Error("Unauthorized");
//    let _conversationId = data.conversationId;
//    if(!data.conversationId && !data.channelId && data.parentMessageId){
//       const parent_message = await Message.findOne({_id : data.parentMessageId});
//       if(!parent_message){
//         throw new Error("Parent message not found");
//       }
//       _conversationId = parent_message.conversationId;
//    };

//    const query = {
//     $and: [
//       data.channelId ? { channelId: data.channelId } : {},
//       data.parentMessageId ? { parentMessageId: data.parentMessageId } : {},
//       _conversationId ? { conversationId: _conversationId } : {},
//     ].filter((condition) => Object.keys(condition).length > 0), 
//   };

//   const page = data.paginationOpts?.page || 1;
//   const limit = data.paginationOpts?.limit || 10;
//   const skip = (page - 1) * limit;
//   const results = await Message.find(query)
//     .sort({ createdAt: -1 }) 
//     .skip(skip) 
//     .limit(limit);
  

//   const total = await Message.countDocuments(query);

//   return {
//     message: "Successfully fetched results",
//     results: await Promise.all(
//       results.map(async (message) => {
//         const member = await populate_member(message.memberId);
//         const user = member ? await populate_user(member.userId) : null;
//         if (!member || !user) {
//           return null;
//         }
  
//         const reactions = await populate_reactions(message._id);
//         const thread = await populate_thread(message._id);
//         const image = message.image ? await Storage.findOne({ _id: message.image }) : undefined;
  
//         const reactionWithCount = reactions.map((reaction) => {
//           return {
//             ...reaction,
//             count: reaction.filter((r) => r.value === reaction.value).length,
//           };
//         });
  
//         const dedupedReactions = reactionWithCount.reduce(
//           (acc, reaction) => {
//             const existingReaction = acc.find((r) => r.value === reaction.value);
//             if (existingReaction) {
//               existingReaction.memberIds = Array.from(
//                 new Set([...existingReaction.memberIds, reaction.memberId])
//               );
//             } else {
//               acc.push({ ...reaction, memberIds: [reaction.memberId] });
//             }
//             return acc;
//           },
//           [] as (Doc<"reactions"> & { count: number; memberIds: ID<"members">[] })[]
//         );
  
//         const reactionsWithoutMembersIdProperty = dedupedReactions.map(({ memberId, ...rest }) => rest);
  
//         return {
//           ...message,
//           image,
//           member,
//           user,
//           reactions: reactionsWithoutMembersIdProperty,
//           threadCount: thread.count,
//           threadImage: thread.image,
//           threadTimestamp: thread.timestamp,
//         };
//       })
//     ).filter((message): message is NonNullable<typeof message> => message !== null),
//     pagination: {
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
  

// }

// return ctx.db.query('messages').withIndex("by_parent_message_id", (q) => q.eq("channelId", channelId)).eq("parentMessageId", parentMessageId).eq("conversationId",_conversationId).order("desc").paginate(paginationopts) 
//  return {
//    ...Result,
//    page : (
//      await Promise.all(resourceLimits.page.map(async(message) =>{
//        const membner = await populate_member(message.memberId)
//        const user = member ?  await populate_user(member.userId) : null;
//        if(!member || !user){
//          return null
//        }
//        const reactions = await populate_reactions(message._id)
//        const thread = await populate_thread(message._id)
//        const image = image ?  await Storage.findOne({_id : message.image})  : undefined
// const reactionwitcount = reactions.map((reaction) =>{
//   return {
//     ...reaction,
//     count : reaction.filter((r) => r.vlaue === reaction.value).length,
//   }
//   const dedupedReactions = reactionwithcount.reduce(
//     (acc,reaction) =>{
//         const existingReaction = acc.find((r) => r.value === reaction.value);
//         if(existingReaction){
//           existingReaction.memberIds = Array.from(
//             new Set([...existingReaction.membersIs, reaction.memberId])
//           )
//         }else{
//           acc.push({...reaction, memberIds : [reaction.memberId]})
//         }
//         return acc;
//     },[] as (Doc<"reactions"> & {count : number ; memberIds : ID<"members">[];})[]
//   )
// })
//  const reactionsWithoutMembersIdProperty = dedupedReactions.map(
//   ({memberId ,...rest}) => rest,

//  )
//  return {
//   ...message,
//   image,
//   member,
//   user,
//   reactions:reactionsWithoutMembersIdProperty,
//   threadcount : thread.count,
//   threadImage : thread.image,
//   threadTimestamp :  thread.timestamp
//  }
//     } )).filter((message) : message is NonNullable<typeof message> => message !== null) 
//   )
// }

// //return ctx.db.get(memberId)
