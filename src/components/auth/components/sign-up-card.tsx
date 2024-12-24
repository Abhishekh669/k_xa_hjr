"use client";
import React, { useState } from "react";
import { SignInFlow } from "../types";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { doSocailLogin } from "@/lib/actions/auth/login";
import { useCreateUser } from "@/utils/hooks/mutateHooks/user/useCreateUser";
import { toast } from "sonner";

interface SignOutProps {
  setState: (state: SignInFlow) => void;
}

function SignUpCard({ setState }: SignOutProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false);
  const { mutate: server_createUser } = useCreateUser();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); 
    setLoading(true); 
    setMessage("");
    try {
      const formData = new FormData(e.currentTarget);
      

    const newUser = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };

      if (newUser.password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (newUser.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      const data = { email: newUser.email, password: newUser.password, name: newUser.name, authProvider : "credentials" };
      server_createUser(data, {
        onSuccess: (response) => {
          if (response.status === 200 && response.message) {
            console.log("this is the response : ",response)
            setLoading(false);
            toast.success("Email sent successfully")
            setMessage(response.message)
          }
          if (response.error) {
            setError(response.error as string);
            toast.error(response.error)
            setLoading(false);
          }
        },
        onError: () => {
          setError("Something went wrong");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an account to continue</CardTitle>
      </CardHeader>
      <CardDescription className="pb-4">
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleRegister}>
          {error && <span className="text-black bg-red-500 p-[3px]  rounded-[2px]">{error}</span>}
          {message && <span className="text-black bg-green-300 p-[3px] rounded-[2px] ">{message}</span>}
          <Input
            name="name"
            disabled={loading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            required
          />
          <Input
            name="email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            name="password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            name="confirmPassword"
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            required
          />
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (<span className="loading loading-spinner loading-md"></span>) : "Continue"}
          </Button>
        </form>
        <Separator />
        <form action={doSocailLogin}>
          <div className="flex flex-col gap-y-2.5">
            <Button
              className="w-full relative"
              variant="outline"
              size="lg"
              disabled={loading}
              value="google"
              type="submit"
              name="action"
            >
              <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
              Continue with Google
            </Button>
            <Button
              className="w-full relative"
              variant="outline"
              size="lg"
              disabled={loading}
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
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 hover:text-sky-500 cursor-pointer"
          >
            Login{" "}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignUpCard;
