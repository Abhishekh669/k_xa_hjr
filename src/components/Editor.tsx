import React, { MutableRefObject, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import Quill, { Delta, Op, type QuillOptions } from "quill";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import { ImageIcon, Smile } from "lucide-react";
import Hint from "./Hint";
import { cn } from "@/lib/utils";

type EditorValue = {
    image : File | null;
    body : string 
}
interface EditorProps {
  onSubmit : ({image, body}: EditorValue) => void;
  onCancel?: ()=> void;
  placeholder ?: string;
  defaultValue ?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: "create" | "update";
}
function Editor({ 
    variant = "create" ,
    onCancel,
    onSubmit,
    placeholder="Write something....",
    defaultValue = [],
    disabled =false,
    innerRef,
    

}: EditorProps) {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVIsible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill|null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  useLayoutEffect(()=>{
    submitRef.current = onSubmit;
    placeholderRef.current=placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current=disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: "snow",
      placeholder:placeholderRef.current,
      modules: {
        toolbar : [
            ["bold", "iltaic", "strike"],
            ["link"],
            [{list : "orderd"}, {list: "bullet"}]
        ],
        keyboard: {
            bindings:{
                enter: {
                    key: "Enter",
                    handler : ()=>{
                                //todo  : submit form
                                return
                    }
                },
                shift_enter:{
                    key : "Enter",
                    shiftKey : true,
                    handler: ()=>{
                        quill.insertText(quill.getSelection()?.index || 0, "\n");
                    }
                }
            }
        }
      }
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if(innerRef){
        innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())
    quill.on(Quill.events.TEXT_CHANGE,()=>{
        setText(quill.getText());
    })

    return () => {
        quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if(quillRef.current){
        quillRef.current = null;
      }
      if(innerRef){
        innerRef.current= null;
      }
    };
  }, [innerRef]);
  const toggleToolbar = ()=>{
    setIsToolbarVIsible((current)=> !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if(toolbarElement){
        toolbarElement.classList.toggle("hidden")
    }
  }
  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length == 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-[5px] overflow-hidden focus-within:border-slate-3000 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom " />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formating"}>
            <Button
              disabled={disabled}
              size={"sm"}
              variant={"ghost"}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4 text-black" />
            </Button>
          </Hint>
          <Hint label="emoji">
            <Button
              disabled={false}
              size={"sm"}
              variant={"ghost"}
              onClick={() => {}}
            >
              <Smile className="size-4 text-black" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={false}
                size={"sm"}
                variant={"ghost"}
                onClick={() => {}}
              >
                <ImageIcon className="size-4 text-black" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={()=>{}}
                    disabled={disabled}
                    className="rounded-[5px] border-none text-black hover:text-black hover:bg-gray-100"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-[#007a5a] rounded-[5px] hover:bg-[#007a5a]/80 text-white"
                    disabled={disabled || isEmpty}
                    onClick={()=>{}}
                    size="sm"
                >
                    Save
                </Button>
            </div>
          )}
          {variant === "create" && (
          <Button
            disabled={disabled || isEmpty}
            onClick={() => {}}
            size="sm"
            className={cn(
                "ml-auto",
               isEmpty ?"bg-white hover:bg-white rounded-[5px] text-muted-foreground"
                : "bg-[#007a5a] rounded-[5px] hover:bg-[#007a5a]/80 text-white"
            ,)}
          >
            <MdSend className="size-4" />
          </Button>
          )}
        </div>
      </div>
      <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
}

export default Editor;
