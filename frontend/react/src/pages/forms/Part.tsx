import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { useState, useEffect, SyntheticEvent } from "react";
import { PartType } from "@/types/part";
import { useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function PartForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const part = (await ky
        .get(`/express/parts/${identifier}`)
        .json()) as PartType;

      setName(part.name.value);
      setReference(part.reference.value);
      setCost(part.cost.value);
      setStock(part.stock.value);
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
        mode === "create" ? "/express/parts" : `/express/parts/${identifier}`;

      const response = await ky[method](endpoint, {
        json: {
          name,
          reference,
          cost,
          stock,
        },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Pièce créée" : "Pièce mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setName("");
          setReference("");
          setCost(0);
          setStock(0);
        }
      }
    } catch {
      toast({
        title:
          mode === "create"
            ? "Erreur lors de la création"
            : "Erreur lors de la mise à jour",
      });
    }
  };
  return (
    <Layout title="Pièces">
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

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="reference">Référence</Label>
          <Input
            id="reference"
            placeholder="Référence"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="cost">Coût</Label>
          <Input
            id="cost"
            type="number"
            placeholder="Coût"
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value))}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/parts")}
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

export function PartCreate() {
  return <PartForm mode="create" />;
}

export function PartUpdate() {
  return <PartForm mode="update" />;
}
