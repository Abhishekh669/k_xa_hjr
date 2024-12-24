import Hint from '@/components/Hint';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import React from 'react'
import { FaCaretDown } from 'react-icons/fa';

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
  return (
    <div className='flex flex-col mt-3 px-2'>
      <div className='flex items-center px-3.5 group'>
        <Button 
          className='p-0.4 text-sm text-[#f9edffcc] shrink-0 size-6'
        >
          <FaCaretDown  className='size-4'/>
        </Button>
        <Button className='group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center'>
          <span className='truncate'>
            {label}
          </span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align='center'>
              <Button onClick={onNew} size="sm" className='size-6 shrink-0 group-hover:opacity-100 opacity-0 transition-opacity ml-auto p-0.5 text-sm'>
                <PlusIcon  className='size-5'/>
              </Button>
          </Hint>
        )}
      </div>
      {children}
    </div>
  )
}

export default WorkspaceSection
