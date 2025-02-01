import { ColumnDef } from "@tanstack/react-table";
import { PartType } from "./part";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

export type BreakdownPartType = {
  part: PartType;
  quantity: number;
};

export type BreakdownType = {
  identifier: string;
  date: {
    value: string;
  };
  description: string;
  rentalIdentifier: string;
  parts: BreakdownPartType[];
  status: string;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
  goToParts,
}: {
  goToUpdate: (breakdown: BreakdownType) => void;
  handleDelete: (breakdown: BreakdownType) => Promise<void>;
  goToParts: (breakdown: BreakdownType) => void;
}): ColumnDef<BreakdownType>[] => {
  return [
    {
      accessorKey: "date.value",
      header: "Date",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "totalCost.value",
      header: "Coût total (€)",
    },
    // {
    //   accessorKey: "rentalIdentifier",
    //   header: "Identifiant de la location",
    // },
    // {
    //   accessorKey: "createdAt",
    //   header: "Date de création",
    // },
    {
      accessorKey: "updatedAt",
      header: "Date de dernière mise à jour",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const breakdown = row.original;

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
              {
                <>
                  <DropdownMenuItem onClick={() => goToUpdate(breakdown)}>
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(breakdown)}>
                    Supprimer
                  </DropdownMenuItem>
                </>
              }
              <DropdownMenuItem onClick={() => goToParts(breakdown)}>
                Voir les pièces
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
