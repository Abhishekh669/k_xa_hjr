"use client";

import React, { Suspense } from "react";
import { NewVerificationForm } from "@/components/auth/components/NewVerificationForm";
import { useSearchParams } from "next/navigation";

function Page() {

  return (
    <div className="w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <NewVerificationForm  />
      </Suspense>
    </div>
  );
}

export default Page;
