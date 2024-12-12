import AuthScreen from '@/components/auth/components/auth-screen'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div>
      <AuthScreen />
      {/* <Link href='/user-dash-board'> Enter App </Link> */}
    </div>
  )
}

export default page



// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
 
// const isProtectedRoute = createRouteMatcher([
//   '/validation',
//   '/admin-dashboard(.*)',
//   '/student-dashboard(.*)',
//   '/hello',
//   '/user-dash-board(.*)'
// ]);
// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// })
// export const config = {
//   // no authentication information
//   matcher: [
//     '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
//     '/', // Run middleware on index page
//     // '/(api|trpc)(.*)'
//   ], // Run middleware on API routes
// };
