import { auth } from "@/auth";
import Model from "@/components/users/Model";

 export default  async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
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
