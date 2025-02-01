import { ColumnDef } from "@tanstack/react-table";
import { PartType } from "./part";

export type BreakdownPartType = {
  part: PartType;
  quantity: number;
  totalCost: number;
};

export const columns = (): ColumnDef<BreakdownPartType>[] => {
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
