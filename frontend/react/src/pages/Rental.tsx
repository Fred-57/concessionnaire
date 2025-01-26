import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { RentalType, columns } from "@/types/rental";
import ky from "ky";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";

export function Rental() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rentals, setRentals] = useState<RentalType[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
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

      const rentalsApi = await api.get("/express/rentals").json();
      setRentals(rentalsApi as RentalType[]);
    };

    fetchRentals();
  }, []);

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
