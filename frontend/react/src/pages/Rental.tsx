import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { RentalType, columns } from "@/types/rental";
import ky from "ky";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { DriverType } from "@/types/driver";
import { createApiClientHeader } from "@/tools/apiClientHeader";

export function Rental() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const companyIdentifier = localStorage.getItem("company_id");
  if (!companyIdentifier) {
    navigate("/home");
    return;
  }

  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [doneFetchingDrivers, setDoneFetchingDrivers] = useState(false);

  const [rentals, setRentals] = useState<RentalType[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversApi = await createApiClientHeader()
        .get("/express/drivers")
        .json();
      setDrivers(driversApi as DriverType[]);
      setDoneFetchingDrivers(true);
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRentals = async () => {
      const rentalsApi = (await createApiClientHeader()
        .get("/express/rentals")
        .json()) as RentalType[];

      // Pour afficher le nom du pilote au lieu de son identifiant
      const rentals = rentalsApi.map((rental) => {
        const driver = drivers.find(
          (driver) => driver.identifier === rental.driverIdentifier
        );
        return {
          ...rental,
          driverIdentifier: driver?.name.value,
        };
      });

      setRentals(rentals as RentalType[]);
    };

    if (doneFetchingDrivers) {
      fetchRentals();
    }
  }, [doneFetchingDrivers]);

  const goToUpdate = (rental: RentalType) => {
    navigate(`/rentals/${rental.identifier}`);
  };

  const handleDelete = async (rental: RentalType) => {
    const response = await ky.delete(`/express/rentals/${rental.identifier}`);
    if (response.ok) {
      toast({
        title: "Location supprimée",
      });

      const newRentals = rentals.filter(
        (b) => b.identifier !== rental.identifier
      );
      setRentals(newRentals);
    } else {
      toast({
        title: "Erreur lors de la suppression de la location",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout
      title="Locations"
      button={{
        label: "Ajouter",
        path: "/rentals/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={rentals}
      />
    </Layout>
  );
}
