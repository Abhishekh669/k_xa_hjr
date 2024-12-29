"use client"
import CreateChannelModal from '@/features/channels/components/create-channel-modal';
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modol'
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react'
function Model({user} : {user : User}) {
  
  return (
    <div>
      <CreateWorkspaceModal user={user} />
      <CreateChannelModal />
    </div>
  )
}

export default Model
