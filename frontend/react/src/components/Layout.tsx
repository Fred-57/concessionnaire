import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <main className="px-10 py-5 flex flex-col gap-2.5 w-screen">
        {children}
      </main>
    </SidebarProvider>
  );
}
