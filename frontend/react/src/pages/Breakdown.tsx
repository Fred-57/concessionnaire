import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { BreakdownType } from "@/types/breakdown";
import { columns } from "@/types/breakdown";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Breakdown() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [breakdowns, setBreakdowns] = useState<BreakdownType[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBreakdowns = async () => {
      const breakdownsApi = await ky.get("/express/breakdowns").json();
      setBreakdowns(breakdownsApi as BreakdownType[]);
      // setIsLoading(false);
    };

    fetchBreakdowns();
  }, [toast]);

  const goToUpdate = (breakdown: BreakdownType) => {
    navigate(`/breakdowns/${breakdown.identifier}`);
  };

  const goToParts = (breakdown: BreakdownType) => {
    navigate(`/breakdowns/${breakdown.identifier}/parts`);
  };

  const handleDelete = async (breakdown: BreakdownType) => {
    try {
      const response = await ky.delete(
        `/express/breakdowns/${breakdown.identifier}`
      );

      if (response.ok) {
        toast({
          title: "Panne supprimée",
        });
      }
      setBreakdowns(
        breakdowns.filter((b) => b.identifier !== breakdown.identifier)
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
      title="Pannes"
      button={{
        label: "Ajouter",
        path: "/breakdowns/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete, goToParts })}
        data={breakdowns}
      />
    </Layout>
  );
}
