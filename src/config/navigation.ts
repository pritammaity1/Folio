export interface NavigationItem {
  label: string;
  path: string;
  icon:
    | "dashboard"
    | "posts"
    | "new-post"
    | "categories"
    | "media"
    | "comments"
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
      {
        label: "Categories",
        path: "/categories",
        icon: "categories",
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
    label: "COMMUNITY",
    items: [
      {
        label: "Comments",
        path: "/comments",
        icon: "comments",
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
