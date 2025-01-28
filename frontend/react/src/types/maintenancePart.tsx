import { ColumnDef } from "@tanstack/react-table";
import { PartType } from "./part";

export type MaintenancePartType = {
  part: PartType;
  quantity: number;
  totalCost: number;
};

export const columns = (): ColumnDef<MaintenancePartType>[] => {
  return [
    {
      accessorKey: "part.identifier",
      header: "ID",
    },
    {
      accessorKey: "part.name.value",
      header: "Nom",
    },
    {
      accessorKey: "part.cost.value",
      header: "Prix",
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
    },
    {
      accessorKey: "totalCost",
      header: "Coût total",
    },
  ];
};
