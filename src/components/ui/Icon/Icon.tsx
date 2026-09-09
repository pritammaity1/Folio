import type { LucideIcon } from "lucide-react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Image,
  KeyRound,
  LayoutDashboard,
  Leaf,
  Link,
  LockKeyhole,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  Upload,
  UserRound,
  Users,
  X,
  Sparkles,
  Check,
  LogOut,
  RotateCcw,
  Pencil,
  ArrowUpRight,
  TriangleAlert,
} from "lucide-react";

export type IconName =
  | "dashboard"
  | "blog"
  | "posts"
  | "new-post"
  | "media"
  | "analytics"
  | "users"
  | "settings"
  | "upload"
  | "plus"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "more"
  | "more-horizontal"
  | "activity"
  | "user"
  | "mail"
  | "key"
  | "check-circle"
  | "arrow-right"
  | "arrow-left"
  | "eye"
  | "eye-off"
  | "lock"
  | "book-open"
  | "menu"
  | "search"
  | "x"
  | "leaf"
  | "link"
  | "clock"
  | "save"
  | "send"
  | "file-text"
  | "image"
  | "sparkles"
  | "check"
  | "logout"
  | "rotate-ccw"
  | "pencil"
  | "arrow-up-right"
  | "triangle-alert";

const icons: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  blog: BookOpen,
  posts: FileText,
  "new-post": FileText,
  media: Image,
  analytics: BarChart3,
  users: Users,
  settings: Settings,
  upload: Upload,
  plus: Plus,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  more: MoreHorizontal,
  "more-horizontal": MoreHorizontal,
  activity: Activity,
  user: UserRound,
  mail: Mail,
  key: KeyRound,
  "check-circle": CheckCircle2,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  eye: Eye,
  "eye-off": EyeOff,
  lock: LockKeyhole,
  "book-open": BookOpen,
  menu: Menu,
  search: Search,
  x: X,
  leaf: Leaf,
  link: Link,
  clock: Clock3,
  save: Save,
  send: Send,
  "file-text": FileText,
  image: Image,
  sparkles: Sparkles,
  check: Check,
  logout: LogOut,
  "rotate-ccw": RotateCcw,
  pencil: Pencil,
  "arrow-up-right": ArrowUpRight,
  "triangle-alert": TriangleAlert,
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
