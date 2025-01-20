import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BrandType } from "@/types/brand";
import { useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function BrandUpdate() {
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

    fetchData();
  }, [identifier]);

  const handleUpdate = async () => {
    const response = await ky.put(`/express/brands/${identifier}`, {
      json: {
        name,
      },
    });
    if (response.ok) {
      toast({
        title: "Marque mise à jour",
      });
    } else {
      toast({
        title: "Erreur lors de la mise à jour",
      });
    }
  };

  return (
    <Layout title="Marques">
      <div className="flex flex-col gap-5 items-start">
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

        <div className="flex gap-5">
          <Button variant="outline" onClick={() => navigate("/brands")}>
            Retour
          </Button>
          <Button onClick={handleUpdate}>Mettre à jour</Button>
        </div>
      </div>
    </Layout>
  );
}
