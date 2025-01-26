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

export enum RentalTypeEnum {
  RENTAL = "RENTAL",
  TRIAL = "TRIAL",
}

export type RentalType = {
  identifier: string;
  startDate: string;
  durationInMonths: {
    value: number;
  };
  type: RentalTypeEnum;
  driverIdentifier: string;
  motorcycleIdentifier: string;
  breakdownIdentifiers: string[];
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
}: {
  goToUpdate: (rental: RentalType) => void;
  handleDelete: (rental: RentalType) => Promise<void>;
}): ColumnDef<RentalType>[] => {
  return [
    {
      accessorKey: "startDate",
      header: "Date de début",
    },
    {
      accessorKey: "durationInMonths.value",
      header: "Durée (en mois)",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const rental = row.original;
        return rental.type === RentalTypeEnum.RENTAL ? "Location" : "Essai";
      },
    },
    {
      accessorKey: "driverIdentifier",
      header: "Pilote",
    },
    {
      accessorKey: "motorcycleIdentifier",
      header: "Moto",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rental = row.original;

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
              <DropdownMenuItem onClick={() => goToUpdate(rental)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(rental)}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
