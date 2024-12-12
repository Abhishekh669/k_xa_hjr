import { auth } from "@/auth";
import Model from "@/components/users/Model";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modol";

 export default  async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log("this is hte session user  in model : ",session?.user)
  return (
        <>
          {session?.user ? (
            <div>
            <Model  user={session?.user}/>
            {children}
        </div>
          ) : (
            <div>
              Something Went Wrong
            </div>
          ) }
        </>
  );
}
