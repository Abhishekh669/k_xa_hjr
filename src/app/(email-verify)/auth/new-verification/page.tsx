"use client";

import React, { Suspense } from "react";
import { NewVerificationForm } from "@/components/auth/components/NewVerificationForm";
import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="w-full h-full">
      {/* Wrap the component inside Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass token to NewVerificationForm */}
        <NewVerificationForm token={token as string} />
      </Suspense>
    </div>
  );
}

export default Page;
