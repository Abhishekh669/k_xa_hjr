"use client"


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { newVerification } from "@/lib/actions/token/new-verification";
import { CircleCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


function NewVerificationForm({token} : {token : string}) {
 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing Token");
      return;
    }

    newVerification(token as string)
      .then((data) => {
        if (data?.success) {
          setSuccess(data.success);
          setMessage("You can now login");
          setError("");
        } else {
          setError(data?.error || "An unknown error occurred");
          setSuccess("");
        }
      })
      .catch(() => {
        setError("Something went wrong");
        setSuccess("");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader className="flex-col items-center">
          <span className="font-semibold text-[20px]">AUTH</span>
          <CardDescription>Confirm your verification</CardDescription>
          {message && (
            <div className="w-full text-[14px] text-red-600 bg-green-300 p-1 rounded-[3px]">
              {message} <CircleCheck />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex justify-center">
          {!success && !error && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {error && (
            <div className="p-1 rounded-[5px] bg-red-500">{error}</div>
          )}
          {success && (
            <div className="p-1 rounded-[5px] bg-green-300">{success}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="bg-white text-black rounded-[20px] hover:bg-white w-full p-4 dark:bg-black"
            onClick={() => {
              router.push("/");
            }}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export { NewVerificationForm};
