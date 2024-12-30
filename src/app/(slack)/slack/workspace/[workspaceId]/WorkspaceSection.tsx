import Hint from '@/components/Hint';
import {useToggle} from "react-use"
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import React from 'react'
import { FaCaretDown } from 'react-icons/fa';
import { cn } from '@/lib/utils';
interface WorkSpaceSectionProps{
    children : React.ReactNode,
    label : string,
    hint : string,
    onNew ? : () => void;

}

function WorkspaceSection({
    children,
    label,
    hint,
    onNew,
}: WorkSpaceSectionProps) {
  const [on,toggle] = useToggle(true);

  return (
    <div className='flex flex-col mt-3 px-2'>
      <div className='flex items-center px-3.5 group'>
        <Button 
          variant={"ghost"}
          className='p-0.4 text-sm  shrink-0 size-6 text-white/50 hover:bg-white/30 rounded-[5px] hover:text-white '
          onClick={toggle}
        >
          <FaCaretDown  className={cn("size-4 transition-transform",
            on && "-rotate-90"
          )}/>
        </Button>
        <Button  variant={"ghost"} className='group px-1.5 text-sm  text-white/50 hover:bg-white/30 rounded-[5px] hover:text-white h-[28px] justify-start overflow-hidden items-center'>
          <span className='truncate'>
            {label}
          </span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align='center'>
              <Button  variant="ghost" onClick={onNew} size="sm" className='size-6 shrink-0 group-hover:opacity-100 opacity-0 transition-opacity ml-auto p-0.5 text-sm group-hover:text-white'>
                <PlusIcon  className='size-5 hover:text-white'/>
              </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  )
}

export default WorkspaceSection