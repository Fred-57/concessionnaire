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

export type BrandType = {
  identifier: string;
  name: {
    value: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
}: {
  goToUpdate: (brand: BrandType) => void;
  handleDelete: (brand: BrandType) => Promise<void>;
}): ColumnDef<BrandType>[] => {
  return [
    {
      accessorKey: "name.value",
      header: "Nom",
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
    },
    {
      accessorKey: "updatedAt",
      header: "Date de mise à jour",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const brand = row.original;

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
              <DropdownMenuItem onClick={() => goToUpdate(brand)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(brand)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
