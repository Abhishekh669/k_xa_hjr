"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { doCredentialLogin, doSocailLogin } from "@/lib/actions/auth/login";
import { useRouter } from "next/navigation";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

function SignInCard({ setState }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    setMessage("")
    setError("")
    try {
      const formData = new FormData(e.currentTarget);
      const response = await doCredentialLogin(formData);
      console.log("this is the repsone in the login : ",response)
      
      if(!!response.error){
        setError(response.error)

      }
      else if (response.success){
        setMessage(response.success)
      }
      else{
        router.push("/slack")
      }
    } catch (error : any) {
      console.log("this is the error : ",error.Error)
      setError(error.Error || "Something went wrong.")
    }
  }

  return (
    <Card className="w-full h-full p-8 ">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <CardDescription className="pb-4">
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit} >
          {error && (<span className="bg-red-600 text-white p-[2px] ">{error}</span>)}
          {message && (<span className="bg-green-300 text-black p-[2px] ">{message}</span>)}
          <Input
            name="email"
            id="email"
            disabled={false}
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            name="password"
            id="password"
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            disabled={false}
            type="submit"
          >
            Continue
          </Button>
        </form>
        <Separator />
        <form action={doSocailLogin}>
          <div className="flex flex-col gap-y-2.5">
            <Button
              className="w-full relative"
              onClick={() => {}}
              variant="outline"
              size="lg"
              disabled={false}
              value="google"
              type="submit"
              name="action"
            >
              <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
              Continue with Google
            </Button>
            <Button
              className="w-full relative"
              onClick={() => {}}
              variant="outline"
              size="lg"
              disabled={false}
              value="github"
              type="submit"
              name="action"
            >
              <FaGithub className="size-5 absolute top-2.5 left-2.5" />
              Continue with GitHub
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-sky-700 hover:text-sky-500 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInCard;
