import { ColumnDef } from "@tanstack/react-table";

export type BrandType = {
  identifier: string;
  name: {
    value: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<BrandType>[] = [
  {
    accessorKey: "name.value",
    header: "Nom",
  },
];
