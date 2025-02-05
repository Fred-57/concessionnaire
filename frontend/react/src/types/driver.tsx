import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export type DriverType = {
  identifier: string;
  name: {
    value: string;
  };
  license: string;
  numberOfYearsOfExperience: number;
  companyIdentifier: string;
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToProfile,
  goToUpdate,
  handleDelete,
}: {
  goToProfile: (driver: DriverType) => void;
  goToUpdate: (driver: DriverType) => void;
  handleDelete: (driver: DriverType) => Promise<void>;
}): ColumnDef<DriverType>[] => {
  return [
    {
      accessorKey: "name.value",
      header: "Nom",
    },
    {
      accessorKey: "license",
      header: "Permis de conduire",
    },
    {
      accessorKey: "numberOfYearsOfExperience",
      header: "Nombre d'années d'expérience",
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
    },
    {
      accessorKey: "updatedAt",
      header: "Date de dernière mise à jour",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const driver = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu des actions</span>{" "}
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => goToProfile(driver)}>
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => goToUpdate(driver)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(driver)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
