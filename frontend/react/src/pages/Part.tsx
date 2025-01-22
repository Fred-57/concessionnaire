import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { PartType, columns } from "@/types/part";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Part() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [parts, setParts] = useState<PartType[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
      const partsApi = await ky.get("/express/parts").json();
      setParts(partsApi as PartType[]);
    };

    fetchParts();
  }, []);

  const goToUpdate = (part: PartType) => {
    navigate(`/parts/${part.identifier}`);
  };

  const handleDelete = async (part: PartType) => {
    const response = await ky.delete(`/express/parts/${part.identifier}`);
    if (response.ok) {
      toast({
        title: "Pièce supprimée",
      });

      const newParts = parts.filter((p) => p.identifier !== part.identifier);
      setParts(newParts);
    } else {
      toast({
        title: "Erreur lors de la suppression",
      });
    }
  };

  return (
    <Layout
      title="Pièces"
      button={{
        label: "Ajouter",
        path: "/parts/create",
      }}
    >
      <DataTable columns={columns({ goToUpdate, handleDelete })} data={parts} />
    </Layout>
  );
}
