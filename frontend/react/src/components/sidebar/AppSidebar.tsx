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

export function AppSidebar({ title }: { title: string }) {
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
              {routes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild isActive={route.title == title}>
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
