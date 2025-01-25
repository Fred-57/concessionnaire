import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { SidebarApplicationInformation } from "./SidebarApplicationInformation";
import { routes } from "@/routes";
import { useAdmin } from "@/context/AdminContext";

export function AppSidebar({ title }: { title: string }) {
  const { isAdmin } = useAdmin();

  // Filter routes based on isAdmin and adminOnly property
  const filteredRoutes = routes.filter((route) => {
    if (isAdmin) return true; // Show all routes if admin
    return !route.adminOnly; // Hide routes marked as adminOnly if not admin
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarApplicationInformation />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Back-office</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild isActive={route.title === title}>
                    <Link to={route.path}>
                      <route.icon />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
