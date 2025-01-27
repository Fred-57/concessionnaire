import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { createApiClientHeader } from "@/tools/apiClientHeader";
import { DriverType, columns } from "@/types/driver";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Driver() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [drivers, setDrivers] = useState<DriverType[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const companyIdentifier = localStorage.getItem("company_id");
      if (!companyIdentifier) {
        navigate("/home");
        return;
      }

      const apiClient = createApiClientHeader();

      const driversApi = await apiClient.get("/express/drivers").json();
      setDrivers(driversApi as DriverType[]);
    };

    fetchDrivers();
  }, [toast]);

  const goToUpdate = (driver: DriverType) => {
    navigate(`/drivers/${driver.identifier}`);
  };

  const handleDelete = async (driver: DriverType) => {
    try {
      const apiClient = createApiClientHeader();
      const response = await apiClient.delete(
        `/express/drivers/${driver.identifier}`
      );
      if (response.ok) {
        toast({
          title: "Conducteur supprimé",
        });

        setDrivers(drivers.filter((d) => d.identifier !== driver.identifier));
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
      title="Conducteurs"
      button={{
        label: "Ajouter",
        path: "/drivers/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={drivers}
      />
    </Layout>
  );
}
