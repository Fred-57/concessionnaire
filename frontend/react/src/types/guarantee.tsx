import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

export type GuaranteeType = {
  identifier: string;
  name: {
    value: string;
  };
  durationInMonths: {
    value: number;
  };
  coveredAmount: {
    value: number;
  };
  partsIdentifiers: string[];
  motorcyclesIdentifiers: string[];
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
}: {
  goToUpdate: (guarantee: GuaranteeType) => void;
  handleDelete: (guarantee: GuaranteeType) => Promise<void>;
}): ColumnDef<GuaranteeType>[] => {
  return [
    {
      accessorKey: "name.value",
      header: "Nom",
    },
    {
      accessorKey: "durationInMonths.value",
      header: "Durée (mois)",
    },
    {
      accessorKey: "coveredAmount.value",
      header: "Montant couvert (€)",
    },
    {
      accessorKey: "partsIdentifiers.length",
      header: "Pièces",
    },
    {
      accessorKey: "motorcyclesIdentifiers.length",
      header: "Motos",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const guarantee = row.original;

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
              <DropdownMenuItem onClick={() => goToUpdate(guarantee)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(guarantee)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
