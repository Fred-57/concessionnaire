import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from "./header/AppHeader";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { AdminProvider } from "@/context/AdminContext";

export function Layout({
  title,
  button,
  children,
}: {
  title: string;
  button?: {
    label: string;
    path: string;
  };
  children: React.ReactNode;
}) {
  const isAdmin =
    localStorage.getItem("role") === "gestionnaire" ||
    localStorage.getItem("is_admin") === "true"
      ? true
      : false;

  const navigate = useNavigate();

  return (
    <AdminProvider>
      <SidebarProvider className="h-screen">
        <AppSidebar title={title} />
        <main className="flex flex-col w-screen">
          <AppHeader />
          <section className="p-4 flex flex-col gap-5">
            <div className="flex justify-between items-center h-10">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {button && isAdmin && (
                <Button
                  onClick={() => navigate(button.path)}
                  className="self-start"
                >
                  {button.label}
                </Button>
              )}
            </div>
            {children}
          </section>
        </main>
      </SidebarProvider>
      <Toaster />
    </AdminProvider>
  );
}
