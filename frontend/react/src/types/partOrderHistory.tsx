import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export type PartOrderHistoryType = {
  identifier: string;
  date: {
    value: string;
  };
  quantity: number;
  cost: number;
  status: string;
  partIdentifier: {
    value: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  handleCancelOrder,
}: {
  handleCancelOrder: (order: PartOrderHistoryType) => Promise<void>;
}): ColumnDef<PartOrderHistoryType>[] => {
  return [
    {
      accessorKey: "date.value",
      header: "Date",
    },
    {
      accessorKey: "quantity.value",
      header: "Quantité",
    },
    {
      accessorKey: "cost",
      header: "Coût",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "partIdentifier.value",
      header: "Pièce",
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu des actions</span>{" "}
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleCancelOrder(row.original)}
                disabled={
                  row.original.status === "CANCELED" ||
                  row.original.status === "RECEIVED"
                }
              >
                Annuler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
