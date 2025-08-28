import type { ReactNode } from "react";
import UserHeader from "../shared/user-header";
import Sidebar from "../shared/sidebar";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserHeader />
      <div className="flex h-full flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {title && (
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
