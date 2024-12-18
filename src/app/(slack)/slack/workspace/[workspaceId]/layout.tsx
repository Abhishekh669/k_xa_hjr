"use client";
import SlideBar from "./SlideBar";
import Toolbar from "./Toolbar";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import WorkspaceSideBar from "./WorkspaceSideBar";

interface WorksSpaceIdLayoutProps {
  children: React.ReactNode;
}
const WorksSpaceIdLayout = ({ children }: WorksSpaceIdLayoutProps) => {
  return (
    <div className="w-full h-full ">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SlideBar />
        <ResizablePanelGroup direction="horizontal" autoSaveId="workspace-layout">
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
           <WorkspaceSideBar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
export default WorksSpaceIdLayout;
