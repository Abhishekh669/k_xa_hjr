"use client"
import React, { Suspense } from 'react'
import {NewVerificationForm} from '@/components/auth/components/NewVerificationForm'
import { useSearchParams } from 'next/navigation';

function page() {
   const searchParams = useSearchParams();
    const token = searchParams.get("token");
  return (
    <div className='w-full h-full'>
       <Suspense fallback={<div>Loading...</div>}></Suspense>
      <NewVerificationForm  token={token as string}/>
    </div>
  )
}

export default page;
