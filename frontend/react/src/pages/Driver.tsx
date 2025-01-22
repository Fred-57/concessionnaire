import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { DriverType, columns } from "@/types/driver";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Driver() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [drivers, setDrivers] = useState<DriverType[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversApi = await ky.get("/nest/drivers").json();
      setDrivers(driversApi as DriverType[]);
    };

    fetchDrivers();
  }, [toast]);

  const goToUpdate = (driver: DriverType) => {
    navigate(`/drivers/${driver.identifier}`);
  };

  const handleDelete = async (driver: DriverType) => {
    try {
      const response = await ky.delete(`/nest/drivers/${driver.identifier}`);
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
