import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useEffect, useState } from "react";
import { ModelType } from "@/types/model";
import { useNavigate, useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ModelForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [repairMileage, setRepairMileage] = useState<number>(0);
  const [repairDeadline, setRepairDeadline] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const model = (await ky
        .get(`/express/models/${identifier}`)
        .json()) as ModelType;

      setName(model.name.value);
      setRepairMileage(model.repairMileage);
      setRepairDeadline(model.repairDeadline.value);
    };

    if (mode === "update") {
      fetchData();
    }
  }, [mode, identifier]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create" ? "/express/models" : `/express/models/${identifier}`;

      const response = await ky[method](endpoint, {
        json: { name, repairMileage, repairDeadline },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Modèle créé" : "Modèle mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setName("");
          setRepairMileage(0);
          setRepairDeadline(0);
        }
      }
    } catch {
      toast({
        title:
          mode === "create"
            ? "Erreur lors de la création"
            : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Modèles">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Repair Mileage */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="repairMileage">Kilométrage de réparation</Label>
          <Input
            id="repairMileage"
            placeholder="Kilométrage de réparation"
            value={repairMileage}
            onChange={(e) => setRepairMileage(Number(e.target.value))}
          />
        </div>

        {/* Repair Deadline */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="repairDeadline">Délai de réparation</Label>
          <Input
            id="repairDeadline"
            placeholder="Délai de réparation"
            value={repairDeadline}
            onChange={(e) => setRepairDeadline(Number(e.target.value))}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/models")}
          >
            Retour
          </Button>
          <Button type="submit">
            {mode === "create" ? "Créer" : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Layout>
  );
}

export function ModelCreate() {
  return <ModelForm mode="create" />;
}

export function ModelUpdate() {
  return <ModelForm mode="update" />;
}
