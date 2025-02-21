import { doLogout } from '@/lib/actions/auth/login'
import React from 'react'
import { Button } from '../ui/button'
import { LogOut } from 'lucide-react';

function Logout() {
  return (
      <Button  variant="ghost" className=' bg-white/80 rounded-[5px] hover:bg-white/90  w-full flex gap-x-4 flex-start' onClick={() =>{
        doLogout()
      }}>
        <LogOut />LogOut 
      </Button>
  )
}

export default Logout
