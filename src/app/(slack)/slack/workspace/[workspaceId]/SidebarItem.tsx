import { Button } from "@/components/ui/button";
import { useWorkSpaceId } from "@/utils/hooks/workSpaceHook/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import {cva, type VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
    "flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/20  rounded-[5px] justify-center justify-start font-normal h-7 px-[18px] text-sm overflow-hidden ",
    {
        variants : {
            variant : {
                default : "",
                active : " bg-white/50 hover:bg-white/50 "
            }
        },
        defaultVariants : {
            variant : "default"
        }
    },
    
)

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"]
}

export const SidebarItem = ({ label, id, icon: Icon, variant }: SidebarItemProps) => {
  const workspaceId = useWorkSpaceId();

  return (
    <Button asChild
        variant={"ghost"}
        className={cn(
            sidebarItemVariants({variant})
        )}
    >
      <Link href={`/slack/workspace/${workspaceId}/channel/${id}`}>
        <Icon  className="size-3.5 mr-1 shrink-0"/>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};