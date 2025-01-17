import { SidebarTrigger } from "../ui/sidebar";
import { HeaderCommand } from "./HeaderCommand";
import { HeaderUser } from "./HeaderUser";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background px-4 lg:h-[60px]">
      <SidebarTrigger />
      <HeaderCommand />
      <div className="flex-1" />
      <HeaderUser />
    </header>
  );
}
