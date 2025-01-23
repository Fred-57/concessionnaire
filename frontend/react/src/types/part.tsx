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

export type PartType = {
  identifier: string;
  reference: {
    value: string;
  };
  name: {
    value: string;
  };
  cost: {
    value: number;
  };
  stock: {
    value: number;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
}: {
  goToUpdate: (part: PartType) => void;
  handleDelete: (part: PartType) => Promise<void>;
}): ColumnDef<PartType>[] => {
  return [
    {
      accessorKey: "reference.value",
      header: "Référence",
    },
    {
      accessorKey: "name.value",
      header: "Nom",
    },
    {
      accessorKey: "cost.value",
      header: "Coût",
    },
    {
      accessorKey: "stock.value",
      header: "Stock",
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
        const part = row.original;

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
              <DropdownMenuItem onClick={() => goToUpdate(part)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(part)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
