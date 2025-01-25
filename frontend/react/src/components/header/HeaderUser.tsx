import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, UserCircle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface RoleInterface {
  name: string;
  initials: string;
  icon: React.ReactNode;
}

const ROLES: Record<string, RoleInterface> = {
  gestionnaire: {
    name: "Gestionnaire",
    initials: "GN",
    icon: <Building2 />,
  },
  client: {
    name: "Client",
    initials: "CL",
    icon: <UserCircle />,
  },
};

export function HeaderUser() {
  const { isAdmin, toggleAdmin } = useAdmin();

  const [role, setRole] = useState("gestionnaire");

  const handleAdminToggle = (checked: boolean) => {
    toggleAdmin(checked);
  };

  const handleClick = () => {
    const newRole = role === "client" ? "gestionnaire" : "client";
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarFallback className="rounded-full">
            {ROLES[role].initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex items-center justify-between px-2 py-2">
          <DropdownMenuLabel>Administrateur</DropdownMenuLabel>
          <Switch
            checked={isAdmin}
            onCheckedChange={handleAdminToggle}
            aria-label="Admin toggle"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Changer de rôle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(ROLES).map((role) => (
          <DropdownMenuItem key={role.name} onClick={handleClick}>
            {role.icon}
            <DropdownMenuItem key={role.name}>{role.name}</DropdownMenuItem>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
