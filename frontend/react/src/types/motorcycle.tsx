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

const isAdmin =
  localStorage.getItem("role") === "gestionnaire" ||
  localStorage.getItem("is_admin") === "true"
    ? true
    : false;

export type MotorcycleType = {
  identifier: string;
  mileage: {
    value: number;
  };
  dateOfCommissioning: string;
  status: {
    value: string;
  };
  companyIdentifier: string;
  modelIdentifier: string;
  guaranteeIdentifier: string | null;
  rentalIdentifiers: string[];
  maintenanceIdentifiers: string[];
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToProfile,
  goToUpdate,
  handleDelete,
}: {
  goToProfile: (motorcycle: MotorcycleType) => void;
  goToUpdate: (motorcycle: MotorcycleType) => void;
  handleDelete: (motorcycle: MotorcycleType) => Promise<void>;
}): ColumnDef<MotorcycleType>[] => {
  return [
    {
      accessorKey: "identifier",
      header: "VIN",
    },
    {
      accessorKey: "mileage.value",
      header: "Kilométrage",
    },
    {
      accessorKey: "dateOfCommissioning",
      header: "Date de mise en service",
    },
    {
      accessorKey: "status.value",
      header: "Statut",
    },
    {
      accessorKey: "modelIdentifier",
      header: "Modèle",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const motorcycle = row.original;

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
              <DropdownMenuItem onClick={() => goToProfile(motorcycle)}>
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => goToUpdate(motorcycle)}>
                Modifier
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => handleDelete(motorcycle)}>
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
