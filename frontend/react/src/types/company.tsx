import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

export enum CompanyTypeEnum {
  CAR_DEALER = "CAR_DEALER",
  PARTNER = "PARTNER",
}

export type CompanyType = {
  identifier: string;
  name: {
    value: string;
  };
  type: CompanyTypeEnum;
  createdAt: string;
  updatedAt: string;
};

export const columns = ({
  goToUpdate,
  handleDelete,
}: {
  goToUpdate: (company: CompanyType) => void;
  handleDelete: (company: CompanyType) => Promise<void>;
}): ColumnDef<CompanyType>[] => {
  const { toast } = useToast();

  const impersonate = (company: CompanyType) => {
    localStorage.setItem("company_id", company.identifier);
    toast({
      title: "Vous êtes maintenant dans l'entreprise " + company.name.value,
    });
  };

  return [
    {
      accessorKey: "name.value",
      header: "Nom",
    },
    {
      accessorKey: "type",
      header: "Type",
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
        const company = row.original;

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
              <DropdownMenuItem onClick={() => goToUpdate(company)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(company)}>
                Supprimer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => impersonate(company)}>
                Usurper
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
