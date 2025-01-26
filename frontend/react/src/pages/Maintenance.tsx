import { Layout } from "@/components/Layout";
import { columns } from "@/types/maintenance";
import { DataTable } from "@/components/ui/data-table";
import { useEffect, useState } from "react";
import ky from "ky";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { MaintenanceType } from "@/types/maintenance";

export function Maintenance() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [maintenances, setMaintenances] = useState<MaintenanceType[]>([]);

  useEffect(() => {
    const fetchMaintenances = async () => {
      const maintenancesApi = await ky.get("/express/maintenances").json();
      setMaintenances(maintenancesApi as MaintenanceType[]);
    };

    fetchMaintenances();
  }, [toast]);

  const goToUpdate = (maintenance: MaintenanceType) => {
    navigate(`/maintenances/${maintenance.identifier}`);
  };

  const goToParts = (maintenance: MaintenanceType) => {
    navigate(`/maintenances/${maintenance.identifier}/parts`);
  };

  const handleDelete = async (maintenance: MaintenanceType) => {
    try {
      const response = await ky.delete(
        `/express/maintenances/${maintenance.identifier}`
      );

      if (response.ok) {
        toast({
          title: "Maintenance supprimée",
        });
      }
      setMaintenances(
        maintenances.filter((m) => m.identifier !== maintenance.identifier)
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
      title="Maintenances"
      button={{
        label: "Ajouter",
        path: "/maintenances/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete, goToParts })}
        data={maintenances}
      />
    </Layout>
  );
}
