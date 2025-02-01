import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { createApiClientHeader } from "@/tools/apiClientHeader";
import { BreakdownPartType, BreakdownType } from "@/types/breakdown";
import { PartType } from "@/types/part";
import { RentalType } from "@/types/rental";
import ky from "ky";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

export function BreakdownForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rentalIdentifier, setRentalIdentifier] = useState<string>("");
  const [rentals, setRentals] = useState<RentalType[]>([]);
  const [parts, setParts] = useState<BreakdownPartType[]>([]);
  const [status, setStatus] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedParts, setSelectedParts] = useState<BreakdownPartType[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const apiClient = createApiClientHeader();
      const breakdown = (await apiClient
        .get(`/express/breakdowns/${identifier}`)
        .json()) as BreakdownType;
      setDate(breakdown.date.value);
      setDescription(breakdown.description);
      setRentalIdentifier(breakdown.rentalIdentifier);
      setSelectedParts(breakdown.parts);
      setStatus(breakdown.status);
      setTotalCost(breakdown.totalCost);
    };

    // Fetch parts
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

    // Fetch rentals
    const fetchRentals = async () => {
      const companyIdentifier = localStorage.getItem("company_id");
      if (!companyIdentifier) {
        navigate("/home");
        return;
      }
      const apiClient = createApiClientHeader();
      const rentals = await apiClient.get("/express/rentals").json();
      setRentals(rentals as RentalType[]);
    };

    fetchParts();
    fetchRentals();

    if (mode === "update") {
      fetchData();
    }
  }, [mode, identifier, navigate]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/breakdowns"
          : `/express/breakdowns/${identifier}`;

      const apiClient = createApiClientHeader();

      const response = await apiClient[method](endpoint, {
        json: { date, description, rentalIdentifier, parts, status, totalCost },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Panne créée" : "Panne mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setDate("");
          setDescription("");
          setRentalIdentifier("");
          setSelectedParts([]);
          setSelectedPartId("");
          setStatus("");
          setTotalCost(0);
          setQuantity(1);
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
    <Layout title="Pannes">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {/* Date */}
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="DONE">Terminé</SelectItem>
              <SelectItem value="CANCELED">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Number of years of experience */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <h4 className="text-sm font-medium leading-none">
                  Détails panne
                </h4>
              </div>
              <Textarea
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                placeholder="Donnez des détails sur la panne..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="rentalIdentifier">Location</Label>
          <Select
            value={rentalIdentifier}
            onValueChange={(value) => {
              setRentalIdentifier(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une location">
                {rentalIdentifier
                  ? rentals.find(
                      (rental) => rental.identifier === rentalIdentifier
                    )?.identifier || rentalIdentifier
                  : "Sélectionner une location"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {rentals.map((rental) => (
                <SelectItem key={rental.identifier} value={rental.identifier}>
                  {rental.createdAt} - {rental.motorcycleIdentifier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                    {part.part.name.value}
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

export function BreakdownCreate() {
  return <BreakdownForm mode="create" />;
}

export function BreakdownUpdate() {
  return <BreakdownForm mode="update" />;
}
