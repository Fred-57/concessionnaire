import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MaintenancePartType, MaintenanceType } from "@/types/maintenance";
import { MotorcycleType } from "@/types/motorcycle";
import { TrashIcon } from "lucide-react";
import { PartType } from "@/types/part";

export function MaintenanceForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [date, setDate] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");
  const [motorcycleIdentifier, setMotorcycleIdentifier] = useState<string>("");
  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([]);
  const [parts, setParts] = useState<MaintenancePartType[]>([]);
  const [selectedParts, setSelectedParts] = useState<MaintenancePartType[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchParts = async () => {
      const parts = await ky.get("/express/parts").json();
      const formattedParts = (parts as PartType[]).map((part) => ({
        part: {
          identifier: part.identifier,
          reference: part.reference,
          name: part.name,
          cost: part.cost,
          stock: part.stock,
          createdAt: part.createdAt,
          updatedAt: part.updatedAt,
        },
        quantity: 1,
      }));
      setParts(formattedParts);
    };

    const fetchMotorcycles = async () => {
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

      const motorcyclesApi = await api.get("/express/motorcycles").json();
      setMotorcycles(motorcyclesApi as MotorcycleType[]);
    };

    fetchParts();
    fetchMotorcycles();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const maintenance = (await ky
        .get(`/express/maintenances/${identifier}`)
        .json()) as MaintenanceType;

      const formattedDate = new Date(maintenance.date)
        .toISOString()
        .split("T")[0];
      setDate(formattedDate);
      setRecommendation(maintenance.recommendation);
      setMotorcycleIdentifier(maintenance.motorcycleIdentifier);
      setSelectedParts(maintenance.parts);
    };
    if (mode === "update") {
      // setTimeout to avoid Select for MotorcycleSelected component not updating
      setTimeout(() => {
        fetchData();
      }, 1000);
    }
  }, [mode, identifier]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/maintenances"
          : `/express/maintenances/${identifier}`;

      const response = await ky[method](endpoint, {
        json: {
          date: new Date(date).toISOString(),
          recommendation,
          motorcycleIdentifier,
          parts: selectedParts,
        },
      });

      if (response.ok) {
        toast({
          title:
            mode === "create" ? "Maintenance créée" : "Maintenance mise à jour",
        });

        // Reset form
        setDate("");
        setRecommendation("");
        setMotorcycleIdentifier("");
        setSelectedParts([]);
        setSelectedPartId("");
        setQuantity(1);
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

  const handleAddPart = () => {
    if (!selectedPartId) return;

    const partToAdd = parts.find(
      (part) => part.part.identifier === selectedPartId
    );
    if (!partToAdd) return;

    const partExists = selectedParts.find(
      (part) => part.part.identifier === selectedPartId
    );
    if (partExists) {
      setSelectedParts(
        selectedParts.map((part) =>
          part.part.identifier === selectedPartId
            ? { ...part, quantity: part.quantity + quantity }
            : part
        )
      );
    } else {
      setSelectedParts([
        ...selectedParts,
        {
          part: {
            identifier: partToAdd.part.identifier,
            reference: partToAdd.part.reference,
            name: partToAdd.part.name,
            cost: partToAdd.part.cost,
            stock: partToAdd.part.stock,
            createdAt: partToAdd.part.createdAt,
            updatedAt: partToAdd.part.updatedAt,
          },
          quantity,
        },
      ]);
    }

    setSelectedPartId("");
    setQuantity(1);
  };

  const handleRemovePart = (identifier: string) => {
    setSelectedParts(
      selectedParts.filter((part) => part.part.identifier !== identifier)
    );
  };

  return (
    <Layout title="Entretiens">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Date */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Recommendation */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="recommendation">Recommandation</Label>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <h4 className="text-sm font-medium leading-none">
                  Notes techniques
                </h4>
              </div>
              <Textarea
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                placeholder="Ajoutez vos recommandations techniques..."
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
              />
              <div className="flex items-center text-xs text-muted-foreground">
                <span>
                  Utilisez cette zone pour détailler les interventions
                  nécessaires
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Motorcycle */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="motorcycleIdentifier">Moto</Label>
          <Select
            value={motorcycleIdentifier}
            onValueChange={(value) => {
              setMotorcycleIdentifier(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une moto"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {motorcycles.map((motorcycle) => (
                <SelectItem
                  key={motorcycle.identifier}
                  value={motorcycle.identifier}
                >
                  {motorcycle.identifier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parts */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Pièces</Label>
          <div className="flex gap-2">
            <Select value={selectedPartId} onValueChange={setSelectedPartId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sélectionner une pièce" />
              </SelectTrigger>
              <SelectContent>
                {parts.map((part) => (
                  <SelectItem
                    key={part.part.identifier}
                    value={part.part.identifier}
                  >
                    {part.part.identifier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-24"
            />
            <Button type="button" onClick={handleAddPart}>
              Ajouter
            </Button>
          </div>

          <div className="mt-2">
            {selectedParts.map((part) => (
              <div
                key={part.part.identifier}
                className="flex items-center gap-2 mt-1"
              >
                <span>
                  {part.part.identifier} (x{part.quantity})
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemovePart(part.part.identifier)}
                >
                  <TrashIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/maintenances")}
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

export function MaintenanceCreate() {
  return <MaintenanceForm mode="create" />;
}

export function MaintenanceUpdate() {
  return <MaintenanceForm mode="update" />;
}
