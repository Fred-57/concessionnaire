import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import ky from "ky";
import { useEffect, useState } from "react";
import { columns, MotorcycleType } from "@/types/motorcycle";
import { DataTable } from "@/components/ui/data-table";
import { createApiClientHeader } from "@/tools/apiClientHeader";
import { RentalType } from "@/types/rental";

export function Motorcycle() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([]);
  const [rentals, setRentals] = useState<RentalType[]>([]);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      const companyIdentifier = localStorage.getItem("company_id");
      if (!companyIdentifier) {
        navigate("/home");
        return;
      }

      const apiClient = createApiClientHeader();

      const motorcyclesApi = (await apiClient
        .get("/express/motorcycles")
        .json()) as MotorcycleType[];
      const role = localStorage.getItem("role");
      if (role === "client") {
        const driver = JSON.parse(localStorage.getItem("driver") || "{}");
        const rentalsApi = (await apiClient
          .get("/express/rentals")
          .json()) as RentalType[];

        setRentals(rentalsApi as RentalType[]);
        const rentalFiltered = rentalsApi.filter(
          (rental: RentalType) => rental.driverIdentifier === driver.identifier
        );

        const motorcyclesFiltered = motorcyclesApi.filter(
          (moto: MotorcycleType) =>
            rentalFiltered.some(
              (rental: RentalType) =>
                rental.motorcycleIdentifier === moto.identifier
            )
        );

        setMotorcycles(motorcyclesFiltered as MotorcycleType[]);
      } else {
        setMotorcycles(motorcyclesApi as MotorcycleType[]);
      }
    };

    fetchMotorcycles();
  }, []);

  const goToProfile = (motorcycle: MotorcycleType) => {
    navigate(`/motorcycles/${motorcycle.identifier}/profile`);
  };

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
        columns={columns({ goToProfile, goToUpdate, handleDelete })}
        data={motorcycles}
      />
    </Layout>
  );
}
