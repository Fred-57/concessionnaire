import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useEffect, useState } from "react";
import { ModelType } from "@/types/model";
import { useNavigate, useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandType } from "@/types/brand";

export function ModelForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [repairMileage, setRepairMileage] = useState<number>(0);
  const [repairDeadline, setRepairDeadline] = useState<number>(0);
  const [brandIdentifier, setBrandIdentifier] = useState<string>("");
  const [brands, setBrands] = useState<BrandType[]>([]);

  // Get brands
  useEffect(() => {
    const fetchBrands = async () => {
      const brandsApi = await ky.get("/express/brands").json();
      setBrands(brandsApi as BrandType[]);
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const model = (await ky
        .get(`/express/models/${identifier}`)
        .json()) as ModelType;
      console.log(model.brandIdentifier);

      setName(model.name.value);
      setRepairMileage(model.repairMileage);
      setRepairDeadline(model.repairDeadline.value);
      setBrandIdentifier(model.brandIdentifier);
    };

    if (mode === "update") {
      fetchData();
    }
  }, [mode, identifier]);

  //force refresh to get the name of the brand preselected
  useEffect(() => {
    if (brands.length > 0 && mode === "update") {
      const associateBrand = brands.find(
        (brand) => brand.identifier === brandIdentifier
      );
      if (associateBrand) {
        setBrandIdentifier(associateBrand.identifier);
      }
    }
  }, [brands, brandIdentifier, mode]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create" ? "/express/models" : `/express/models/${identifier}`;

      const response = await ky[method](endpoint, {
        json: { name, repairMileage, repairDeadline, brandIdentifier },
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
          setBrandIdentifier("");
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

        {/* Brand Identifier */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Marque associée</Label>
          <Select
            value={brandIdentifier}
            // defaultValue={brandIdentifier}
            onValueChange={(value) => setBrandIdentifier(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Séléctionner une marque" />
            </SelectTrigger>
            <SelectContent>
              {/* Brands */}
              {brands.map((brand) => (
                <SelectItem key={brand.identifier} value={brand.identifier}>
                  {brand.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
