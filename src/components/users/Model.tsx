"use client"
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modol'
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react'
function Model({user} : {user : User}) {
  
  return (
    <div>
      <CreateWorkspaceModal user={user} />
    </div>
  )
}

export default Model
