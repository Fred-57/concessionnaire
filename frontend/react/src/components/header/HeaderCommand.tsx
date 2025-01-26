import { useState, useEffect, MouseEvent } from "react";
import { Command as CommandIcon, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { routes } from "@/routes";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router";
import { HeaderCompanies } from "./HeaderCompanies";

export function HeaderCommand() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpen((open) => !open);
  };

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="flex justify-between gap-2 w-full">
      <div className="relative">
        <Search className="absolute top-0 left-0 w-5 h-5 m-2 text-muted-foreground" />
        <input
          type="search"
          className="flex border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9 cursor-pointer rounded-md border pl-10 pr-4 text-sm shadow-sm"
          placeholder="Rechercher..."
          onClick={handleClick}
        />
        <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 font-mono text-xs font-medium dark:bg-neutral-700 sm:flex">
          <CommandIcon className="size-3" />
          <span>k</span>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <DialogTitle className="sr-only">Rechercher</DialogTitle>
          <Description className="sr-only">
            Rechercher une page ou une fonctionnalité.
          </Description>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Triumph Motorcycles">
              {routes.map((route) => (
                <CommandItem
                  key={route.path}
                  onSelect={() => handleSelect(route.path)}
                >
                  {route.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* Select Companies  */}
      <HeaderCompanies />
    </div>
  );
}
