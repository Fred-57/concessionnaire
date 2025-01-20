import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { BrandType, columns } from "@/types/brand";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Brand() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [brands, setBrands] = useState<BrandType[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsApi = await ky.get("/express/brands").json();
      setBrands(brandsApi as BrandType[]);
    };

    fetchBrands();
  }, []);

  const goToUpdate = (brand: BrandType) => {
    navigate(`/brands/${brand.identifier}`);
  };

  const handleDelete = async (brand: BrandType) => {
    const response = await ky.delete(`/express/brands/${brand.identifier}`);
    if (response.ok) {
      toast({
        title: "Marque supprimée",
      });

      const newBrands = brands.filter((b) => b.identifier !== brand.identifier);
      setBrands(newBrands);
    } else {
      toast({
        title: "Erreur lors de la suppression",
      });
    }
  };

  return (
    <Layout title="Marques">
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={brands}
      />
    </Layout>
  );
}
