"use client"
import React from 'react'
import {NewVerificationForm} from '@/components/auth/components/NewVerificationForm'
import { useSearchParams } from 'next/navigation';

function page() {
   const searchParams = useSearchParams();
    const token = searchParams.get("token");
  return (
    <div className='w-full h-full'>
      <NewVerificationForm  token={token as string}/>
    </div>
  )
}

export default page;
