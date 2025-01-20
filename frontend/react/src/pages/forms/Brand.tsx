import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { useState, useEffect, SyntheticEvent } from "react";
import { BrandType } from "@/types/brand";
import { useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function BrandForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const brand = (await ky
        .get(`/express/brands/${identifier}`)
        .json()) as BrandType;
      setName(brand.name.value);
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
        mode === "create" ? "/express/brands" : `/express/brands/${identifier}`;

      const response = await ky[method](endpoint, {
        json: { name },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Marque créée" : "Marque mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setName("");
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
    <Layout title="Marques">
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

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/brands")}
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

export function BrandCreate() {
  return <BrandForm mode="create" />;
}

export function BrandUpdate() {
  return <BrandForm mode="update" />;
}
