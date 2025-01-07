import { createStorage } from "@/lib/actions/storage/storage";
import { useChannelId } from "@/utils/hooks/channelHook/use-channel-id";
import { useCreateMessage } from "@/utils/hooks/mutateHooks/message/useCreateMessage";
import { useCreateStorage } from "@/utils/hooks/mutateHooks/storage/useCreateStorage";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { useUploadThing } from "@/utils/uploadthing/uploadthing";
import dynamic from "next/dynamic"
import Quill from "quill";
import React, { useRef, useState } from 'react'
import { toast } from "sonner";
const Editor = dynamic(()=> import ("@/components/Editor"),{ssr:false})
interface ChatInputProps{
    placeholder: string

  }
  type create_message_data_type ={
    channelId : string;
    workspaceId : string,
    body : string,
    image ?: string
    updatedAt ?: number
  }

  type storage_data_type = {
    fileName : string,
    mimeType : string,
    fileUrl : string,
    uploadedAt : number,
  }
function ChatInput({placeholder} : ChatInputProps) {
    const editorRef = useRef<Quill|null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [pending, setPending]= useState(false);
    const [storageId, setStorageId] = useState<string | undefined>( )
    const [createdMessage, setCreatedMessage] = useState();
    const workspaceId = useWorkSpaceId();
    const channelId = useChannelId();
    const {startUpload} = useUploadThing("media");
    const {mutate : create_message} = useCreateMessage();
    const {mutate: create_storage, data : storage_data} = useCreateStorage();
    // const handleSubmit = async({body,image}:{
    //   body : string;
    //   image: File | null
    // }) =>{
    //   try {
    //     setPending(true);
    //     editorRef?.current?.enable(false);
    //     const create_message_data:create_message_data_type = {
    //       workspaceId,
    //       channelId,
    //       body,
    //       updatedAt : Date.now(),
    //       image : undefined
    //   };
      
    //   if(image){
    //      const uploadResult = await startUpload([image]);
    //      if(uploadResult && uploadResult[0] && uploadResult[0].url){
    //       var imageUrl = uploadResult[0].url;
    //       var storage_data: storage_data_type = {
    //         fileName : image.name,
    //         mimeType : image.type,
    //         fileUrl : imageUrl,
    //         uploadedAt : Date.now()
    //       }
    //       await create_storage(storage_data,{
    //         onSuccess : (res) =>{
    //             if(res.message && res.storage){
    //               const data = JSON.parse(res.storage);
    //               create_message_data.image = data._id
    //               console.log("this is imageurl : ",create_message_data.image)
    //             }else{
    //               throw new Error("Failed to create image")
    //             }
    //         },
    //         onError : () => {throw new Error("Failed to create image")}})
          
    //      }else if (!uploadResult){
    //       throw new Error("Failed to upload image")
    //      }
    //   }
    //   console.log("i am chekicng me : ",{...create_message_data})
    //   await create_message(create_message_data,{
    //     onSuccess : (res) =>{
    //       if(res.sent_message && res.message){
    //           const data = JSON.parse(res.sent_message);
    //           setCreatedMessage(data.sent_message);
    //       }
    //       else{
    //         throw new Error("Failed to create message")
    //       }
    //     },
    //     onError : () =>{
    //       throw new Error("Failed to create message")
    //     }

    //   })
    //   setEditorKey((prevKey) => prevKey + 1);
    //   } catch (error) {
    //     toast.error("Failed to send message")
    //   }finally{
    //       setPending(false);
    //       editorRef?.current?.enable(true);
    //   }

    // }
    const handleSubmit = async ({
      body,
      image,
    }: {
      body: string;
      image: File | null;
    }) => {
      try {
        setPending(true);
        editorRef?.current?.enable(false);
        
        const create_message_data: create_message_data_type = {
          workspaceId,
          channelId,
          body,
          image: undefined, 
        };
    
        if (image) {
          // Start the upload and wait for it to complete
          const uploadResult = await startUpload([image]);
          if (uploadResult && uploadResult[0] && uploadResult[0].url) {
            const imageUrl = uploadResult[0].url;
            const storage_data: storage_data_type = {
              fileName: image.name,
              mimeType: image.type,
              fileUrl: imageUrl,
              uploadedAt: Date.now(),
            };
    
            // Await the creation of the storage entry
            await create_storage(storage_data, {
              onSuccess:  async (res) => {
                if (res.message && res.storage) {
                  const data = JSON.parse(res.storage);
                  create_message_data.image = data._id; // Add the image ID to message data
                  await create_message(create_message_data, {
                    onSuccess: (res) => {
                      if (res.sent_message && res.message) {
                        const data = JSON.parse(res.sent_message);
                        setCreatedMessage(data.sent_message);
                      } else {
                        throw new Error("Failed to create message");
                      }
                    },
                    onError: () => {
                      throw new Error("Failed to create message");
                    },
                  });
                  
                  console.log("Image ID for message:", create_message_data.image);
                } else {
                  throw new Error("Failed to create image");
                }
              },
              onError: () => {
                throw new Error("Failed to create image");
              },
            });
          } else {
            throw new Error("Failed to upload image");
          }
        }
    
        console.log("Message data to be created:", { ...create_message_data });
    
        // Proceed to create the message after the image is uploaded
        if(!image){
          await create_message(create_message_data, {
            onSuccess: (res) => {
              if (res.sent_message && res.message) {
                const data = JSON.parse(res.sent_message);
                setCreatedMessage(data.sent_message);
              } else {
                throw new Error("Failed to create message");
              }
            },
            onError: () => {
              throw new Error("Failed to create message");
            },
          });
        }
    
        setEditorKey((prevKey) => prevKey + 1);
      } catch (error) {
        toast.error("Failed to send message");
      } finally {
        setPending(false);
        editorRef?.current?.enable(true);
      }
    };
    
  return (
    <div className='px-5 w-full'>
        <Editor
            key={editorKey} 
            variant="create"
            placeholder={placeholder}
            onSubmit={handleSubmit}
            disabled={false}
            innerRef={editorRef}
         />
    </div>
  )
}

export default ChatInput;
