import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import ky from "ky";
import { useEffect, useState } from "react";
import { columns, MotorcycleType } from "@/types/motorcycle";
import { DataTable } from "@/components/ui/data-table";

export function Motorcycle() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([]);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      const companyIdentifier = localStorage.getItem("company_id");
      if (!companyIdentifier) {
        navigate("/home");
        return;
      }

      const api = ky.create({
        headers: {
          "company-identifier": companyIdentifier,
        },
      });

      const motorcyclesApi = await api.get("/express/motorcycles").json();
      setMotorcycles(motorcyclesApi as MotorcycleType[]);
    };

    fetchMotorcycles();
  }, []);

  const goToUpdate = (motorcycle: MotorcycleType) => {
    navigate(`/motorcycles/${motorcycle.identifier}`);
  };

  const handleDelete = async (motorcycle: MotorcycleType) => {
    const response = await ky.delete(
      `/express/motorcycles/${motorcycle.identifier}`
    );
    if (response.ok) {
      toast({
        title: "Moto supprimée",
      });

      const newMotorcycles = motorcycles.filter(
        (b) => b.identifier !== motorcycle.identifier
      );
      setMotorcycles(newMotorcycles);
    } else {
      toast({
        title: "Erreur lors de la suppression de la moto",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout
      title="Motos"
      button={{
        label: "Ajouter",
        path: "/motorcycles/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={motorcycles}
      />
    </Layout>
  );
}
