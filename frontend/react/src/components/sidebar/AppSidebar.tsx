import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bike,
  Bolt,
  Home,
  Key,
  Package,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";
import { NavApp } from "./NavApp";
import { NavUser } from "./NavUser";

// Menu items.
const items = [
  {
    title: "Accueil",
    url: "/home",
    icon: Home,
  },
  {
    title: "Modèles",
    url: "/models",
    icon: Package,
  },
  {
    title: "Motos",
    url: "/bikes",
    icon: Bike,
  },
  {
    title: "Conducteurs",
    url: "/drivers",
    icon: User,
  },
  {
    title: "Locations",
    url: "/rentals",
    icon: Key,
  },
  {
    title: "Pannes",
    url: "/breakdowns",
    icon: TriangleAlert,
  },
  {
    title: "Entretiens",
    url: "/maintenance",
    icon: Wrench,
  },
  {
    title: "Pièces",
    url: "/parts",
    icon: Bolt,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavApp />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Triumph Motorcycles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
