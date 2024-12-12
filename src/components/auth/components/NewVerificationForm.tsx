"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { useRouter, useSearchParams } from 'next/navigation'
import { newVerification } from '@/lib/actions/token/new-verification'
import { CircleCheck } from 'lucide-react'

function NewVerificationForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [message, setMessage ] = useState("")

    const onSubmit = useCallback(()=>{
        if(!token){
            setError("Missing Token")
            return;
        }
        newVerification(token)
        .then((data) =>{

            setSuccess((data?.success) as string);
            if(data?.success){
                setMessage("You can now login")
            }
            setError(data.error as string);
        })
        .catch(() =>{
            setError("Something went wrong")
        })

    },[token])

    useEffect(()=>{
        onSubmit();
    },[onsubmit])
    const router = useRouter();
  return (
    <div className='w-full  h-full flex justify-center items-center'>
        <Card className="w-[350px]">
      <CardHeader className='flex-col items-center'>
        <span className='font-semibold text-[20px]'>AUTH</span>
        <CardDescription>Confirm you verification</CardDescription>
        {message && (<div className='w-full text-[14px]  text-red-600 bg-green-300 p-1 rounded-[3px]'>
            {message} <CircleCheck />
        </div>)}
      </CardHeader>
      <CardContent className='flex justify-center'>
        {!success && !error && (
            <span className="loading loading-dots loading-lg"></span>

        )}
      {error && (<div className='p-1 rounded-[5px] bg-red-500'>{error}</div>)}
      {success && (<div className='p-1 rounded-[5px] bg-green-300'>{success}</div>)}
      </CardContent>
      <CardFooter className="flex justify-between ">
        <Button className='bg-white text-black rounded-[20px] hover:bg-white w-full p-4 dark:bg-black ' onClick={() =>{
            router.push("/")
        }}>Back to login</Button>
      </CardFooter>
    </Card>
      
    </div>
  )
}

export default NewVerificationForm
