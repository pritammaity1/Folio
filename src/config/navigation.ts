export interface NavigationItem {
  label: string;
  path: string;
  icon:
    | "dashboard"
    | "blog"
    | "posts"
    | "new-post"
    | "media"
    | "analytics"
    | "users"
    | "settings";
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export const navigation: NavigationSection[] = [
  {
    label: "WORKSPACE",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
      },
      {
        label: "Blog",
        path: "/blog",
        icon: "blog",
      },
    ],
  },

  {
    label: "CONTENT",
    items: [
      {
        label: "Posts",
        path: "/posts",
        icon: "posts",
      },
      {
        label: "New Post",
        path: "/posts/new",
        icon: "new-post",
      },
    ],
  },

  {
    label: "LIBRARY",
    items: [
      {
        label: "Media",
        path: "/media",
        icon: "media",
      },
    ],
  },

  {
    label: "INSIGHTS",
    items: [
      {
        label: "Analytics",
        path: "/analytics",
        icon: "analytics",
      },
    ],
  },

  {
    label: "ADMINISTRATION",
    items: [
      {
        label: "Users",
        path: "/users",
        icon: "users",
      },
      {
        label: "Settings",
        path: "/settings",
        icon: "settings",
      },
    ],
  },
];
