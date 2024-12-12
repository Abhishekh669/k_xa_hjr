import { auth } from '@/auth';
import HomePage from '@/features/workspaces/api/HomePage';
import { redirect } from 'next/navigation';
import React from 'react'

async function Slack() {
    const session = await auth();
    console.log("this is sesssion in the slack page: ",session)
    // if(!session?.user)  return redirect("/");
    
    
    
  return (
    <div className='w-full h-full '>
        <HomePage  />
    </div>
  )
}

export default Slack;
