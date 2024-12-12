import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modol";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div>
            <CreateWorkspaceModal />
            {children}
        </div>
  );
}
