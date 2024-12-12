import { auth } from '@/auth';
import HomePage from '@/features/workspaces/api/HomePage';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
    const session = await auth();
    // if(!session?.user)  return redirect("/");
    console.log("this is the session in home : ",session)
    
  return (
    <div className='w-full h-full '>
        
        <HomePage />
    </div>
  )
}

export default page
