import type { RouteObject } from "react-router-dom";

import ProtectedRoute from "../components/routing/ProtectedRoute";
import GuestRoute from "../components/routing/GuestRoute";
import AppShell from "../components/layout/AppShell/AppShell";

import Home from "../pages/public/Home/Home";
import SignUp from "../pages/auth/Signup/SignUp";
import Login from "../pages/auth/Login/Login";

import Dashboard from "../pages/dashboard/Dashboard/Dashboard";
import Posts from "../pages/posts/Posts/Posts";
import NewPost from "../pages/posts/NewPost/NewPost";
import MediaLibrary from "../pages/media/MediaLibrary/MediaLibrary";
import Blog from "../pages/blog/Blog/Blog";

import PostPreview from "../pages/posts/PostPreview/PostPreview";
import EditPost from "../pages/posts/EditPost/EditPost";
import Settings from "../pages/settings/Settings/Settings";
interface ComingSoonProps {
  title: string;
}

function ComingSoon({ title }: ComingSoonProps) {
  return (
    <section className="p-12">
      <h1 className="font-display text-[32px] font-semibold text-[var(--color-on-surface)]">
        {title}
      </h1>
      <p className="mt-2 font-body text-[15px] text-[var(--color-on-surface-varient)]">
        This section is part of the Folio architecture and will be implemented
        in its feature phase.
      </p>
    </section>
  );
}

function Unauthorized() {
  return <ComingSoon title="Unauthorized" />;
}

function NotFound() {
  return <ComingSoon title="Page not found" />;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/blog",
            element: <Blog />,
          },
          {
            path: "/posts",
            element: <Posts />,
          },
          {
            path: "/posts/new",
            element: <NewPost />,
          },
          {
            path: "/posts/:id",
            element: <PostPreview />,
          },
          {
            path: "/posts/:id/edit",
            element: <EditPost />,
          },
          {
            path: "/media",
            element: <MediaLibrary />,
          },

          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/settings/profile",
            element: <ComingSoon title="Profile Settings" />,
          },
          {
            path: "/settings/security",
            element: <ComingSoon title="Security Settings" />,
          },
          {
            path: "/settings/notifications",
            element: <ComingSoon title="Notification Settings" />,
          },
          {
            path: "/settings/appearance",
            element: <ComingSoon title="Appearance Settings" />,
          },
          {
            path: "/settings/roles",
            element: <ComingSoon title="Role Settings" />,
          },
        ],
      },
    ],
  },

  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
