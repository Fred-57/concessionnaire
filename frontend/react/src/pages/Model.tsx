import { Layout } from "@/components/Layout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { columns, ModelType } from "@/types/model";
import ky from "ky";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function Model() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [models, setModels] = useState<ModelType[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      const modelsApi = await ky.get("/express/models").json();
      setModels(modelsApi as ModelType[]);
    };

    fetchModels();
  }, []);

  const goToUpdate = (model: ModelType) => {
    navigate(`/models/${model.identifier}`);
  };

  const handleDelete = async (model: ModelType) => {
    const response = await ky.delete(`/express/models/${model.identifier}`);
    if (response.ok) {
      toast({
        title: "Modèle supprimé",
      });

      const newModels = models.filter((b) => b.identifier !== model.identifier);
      setModels(newModels);
    } else {
      toast({
        title: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout
      title="Modèles"
      button={{
        label: "Ajouter",
        path: "/models/create",
      }}
    >
      <DataTable
        columns={columns({ goToUpdate, handleDelete })}
        data={models}
      />
    </Layout>
  );
}
