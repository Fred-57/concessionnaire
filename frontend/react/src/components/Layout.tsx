import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { AppHeader } from "./header/AppHeader";

export function Layout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar title={title} />
      <main className="flex flex-col w-screen">
        <AppHeader />
        <section className="p-4 flex flex-col gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
}
