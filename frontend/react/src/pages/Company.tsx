import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { CompanyType, columns } from "@/types/company";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Company() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companies, setCompanies] = useState<CompanyType[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesApi = await ky.get("/express/companies").json();
      setCompanies(companiesApi as CompanyType[]);
    };

    fetchCompanies();
  }, [toast]);

  const goToUpdate = (company: CompanyType) => {
    navigate(`/companies/${company.identifier}`);
  };

  const handleDelete = async (company: CompanyType) => {
    try {
      const response = await ky.delete(
        `/express/companies/${company.identifier}`
      );
      if (response.ok) {
        toast({
          title: "Entreprise supprimée",
        });

        setCompanies(
          companies.filter((d) => d.identifier !== company.identifier)
        );
      }
    } catch {
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout
      title="Entreprises"
      button={{
        label: "Ajouter",
        path: "/companies/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={companies}
      />
    </Layout>
  );
}
