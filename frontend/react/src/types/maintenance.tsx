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
import { PartType } from "./part";

const isAdmin =
  localStorage.getItem("role") === "gestionnaire" ||
  localStorage.getItem("is_admin") === "true"
    ? true
    : false;

export type MaintenancePartType = {
  part: PartType;

  quantity: number;
};

export type MaintenanceType = {
  identifier: string;
  date: string;
  recommendation: string;
  motorcycleIdentifier: string;
  parts: MaintenancePartType[];
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
  goToParts,
}: {
  goToUpdate: (maintenance: MaintenanceType) => void;
  handleDelete: (maintenance: MaintenanceType) => Promise<void>;
  goToParts: (maintenance: MaintenanceType) => void;
}): ColumnDef<MaintenanceType>[] => {
  return [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "recommendation",
      header: "Recommandation",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "totalCost",
      header: "Coût total",
    },
    {
      accessorKey: "motorcycleIdentifier",
      header: "Moto",
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
        const maintenance = row.original;

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
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => goToUpdate(maintenance)}>
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(maintenance)}>
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => goToParts(maintenance)}>
                Voir les pièces
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
