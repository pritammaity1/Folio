import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  Image,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Settings,
  Upload,
  Users,
  KeyRound,
  Mail,
  UserRound,
  CheckCircle2,
} from "lucide-react";

export type IconName =
  | "dashboard"
  | "posts"
  | "new-post"
  | "categories"
  | "media"
  | "comments"
  | "analytics"
  | "users"
  | "settings"
  | "upload"
  | "plus"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "more"
  | "activity"
  | "user"
  | "mail"
  | "key"
  | "check-circle";

const icons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  posts: FileText,
  "new-post": FileText,
  categories: FolderOpen,
  media: Image,
  comments: MessageCircle,
  analytics: BarChart3,
  users: Users,
  settings: Settings,
  upload: Upload,
  plus: Plus,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  more: MoreHorizontal,
  activity: Activity,
  user: UserRound,
  mail: Mail,
  key: KeyRound,
  "check-circle": CheckCircle2,
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
  className,
}: IconProps) {
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}

export default Icon;
