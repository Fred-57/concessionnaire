import { Layout } from "@/components/Layout";
import { BrandType, columns } from "@/types/brand";
import { DataTable } from "@/components/ui/data-table";
import ky from "ky";
import { useState, useEffect } from "react";

export function Brand() {
  const [brands, setBrands] = useState<BrandType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const brandsApi = await ky.get("/express/brands").json();
      setBrands(brandsApi as BrandType[]);
    };

    fetchData();
  }, []);

  return (
    <Layout title="Marques">
      <DataTable columns={columns} data={brands} />
    </Layout>
  );
}
