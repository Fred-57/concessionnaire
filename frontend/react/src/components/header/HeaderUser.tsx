import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowRightLeft } from "lucide-react";

interface RoleInterface {
  name: string;
  initials: string;
}

const ROLES: Record<string, RoleInterface> = {
  client: {
    name: "Client",
    initials: "CL",
  },
  gestionnaire: {
    name: "Gestionnaire",
    initials: "GN",
  },
};

export function HeaderUser() {
  const [role, setRole] = useState("gestionnaire");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

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
        <DropdownMenuLabel>{ROLES[role].name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClick}>
          <ArrowRightLeft />
          <span>Changer de rôle</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
