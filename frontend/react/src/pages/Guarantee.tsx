import { Layout } from "@/components/Layout";
import { columns } from "@/types/guarantee";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import ky from "ky";
import { useToast } from "@/hooks/use-toast";
import { GuaranteeType } from "@/types/guarantee";
import { useNavigate } from "react-router";

export function Guarantee() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [guarantees, setGuarantees] = useState<GuaranteeType[]>([]);

  useEffect(() => {
    const fetchGuarantees = async () => {
      const guaranteesApi = await ky.get("/express/guarantees").json();
      setGuarantees(guaranteesApi as GuaranteeType[]);
    };

    fetchGuarantees();
  }, [toast]);

  const goToUpdate = (guarantee: GuaranteeType) => {
    navigate(`/guarantees/${guarantee.identifier}`);
  };

  const handleDelete = async (guarantee: GuaranteeType) => {
    try {
      const response = await ky.delete(
        `/express/guarantees/${guarantee.identifier}`
      );

      if (response.ok) {
        toast({
          title: "Garantie supprimée",
        });
      }
      setGuarantees(
        guarantees.filter((g) => g.identifier !== guarantee.identifier)
      );
    } catch {
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout
      title="Garanties"
      button={{
        label: "Ajouter",
        path: "/guarantees/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={guarantees}
      />
    </Layout>
  );
}
