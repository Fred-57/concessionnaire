import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RentalType, RentalTypeEnum } from "@/types/rental";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MotorcycleType } from "@/types/motorcycle";
import { DriverType } from "@/types/driver";

export function RentalForm({ mode }: { mode: "create" | "update" }) {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const [motorcycles, setMotorcycles] = useState<MotorcycleType[]>([]);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [doneFetchingMotorcycles, setDoneFetchingMotorcycles] = useState(false);
  const [doneFetchingDrivers, setDoneFetchingDrivers] = useState(false);

  const [startDate, setStartDate] = useState<string>("");
  const [durationInMonths, setDurationInMonths] = useState<number>(0);
  const [type, setType] = useState<RentalTypeEnum>(RentalTypeEnum.RENTAL);
  const [driverIdentifier, setDriverIdentifier] = useState<string>("");
  const [motorcycleIdentifier, setMotorcycleIdentifier] = useState<string>("");

  // Fetch motorcycles
  useEffect(() => {
    const fetchMotorcycles = async () => {
      const motorcyclesApi = await api.get("/express/motorcycles").json();
      setMotorcycles(motorcyclesApi as MotorcycleType[]);
      setDoneFetchingMotorcycles(true);
    };

    fetchMotorcycles();
  }, []);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      const driversApi = await api.get("/express/drivers").json();
      setDrivers(driversApi as DriverType[]);
      setDoneFetchingDrivers(true);
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const rental = (await api
        .get(`/express/rentals/${identifier}`)
        .json()) as RentalType;

      const date = new Date(rental.startDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const formattedStartDate = `${year}-${month}-${day}`;

      setStartDate(formattedStartDate);
      setDurationInMonths(rental.durationInMonths.value);
      setType(rental.type);
      setDriverIdentifier(rental.driverIdentifier);
      setMotorcycleIdentifier(rental.motorcycleIdentifier);
    };

    if (mode === "update" && doneFetchingMotorcycles && doneFetchingDrivers) {
      fetchData();
    }
  }, [mode, identifier, doneFetchingMotorcycles, doneFetchingDrivers]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const method = mode === "create" ? "post" : "put";
      const endpoint =
        mode === "create"
          ? "/express/rentals"
          : `/express/rentals/${identifier}`;

      const response = await ky[method](endpoint, {
        json: {
          startDate,
          durationInMonths,
          type,
          driverIdentifier,
          motorcycleIdentifier,
        },
      });

      if (response.ok) {
        toast({
          title: mode === "create" ? "Location créée" : "Location mise à jour",
        });

        // Reset form
        if (mode === "create") {
          setStartDate("");
          setDurationInMonths(0);
          setType(RentalTypeEnum.RENTAL);
          setDriverIdentifier("");
          setMotorcycleIdentifier("");
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
    <Layout title="Locations">
      <form className="flex flex-col gap-5 items-start" onSubmit={handleSubmit}>
        {/* Start Date */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            type="date"
            id="startDate"
            placeholder="Date de début"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* Duration in months */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="durationInMonths">Durée (en mois)</Label>
          <Input
            type="number"
            id="durationInMonths"
            placeholder="Durée (en mois)"
            value={durationInMonths}
            onChange={(e) => setDurationInMonths(Number(e.target.value))}
            required
          />
        </div>

        {/* Type */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as RentalTypeEnum)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RentalTypeEnum.RENTAL}>Location</SelectItem>
              <SelectItem value={RentalTypeEnum.TRIAL}>Essai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Driver */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="driverIdentifier">Conducteur</Label>
          <Select
            value={driverIdentifier}
            onValueChange={(value) => setDriverIdentifier(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Conducteur" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.identifier} value={driver.identifier}>
                  {driver.name.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Motorcycle */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="motorcycleIdentifier">Moto</Label>
          <Select
            value={motorcycleIdentifier}
            onValueChange={(value) => setMotorcycleIdentifier(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Moto" />
            </SelectTrigger>
            <SelectContent>
              {motorcycles.map((motorcycle) => (
                <SelectItem value={motorcycle.identifier}>
                  {motorcycle.identifier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/rentals")}
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

export function RentalCreate() {
  return <RentalForm mode="create" />;
}

export function RentalUpdate() {
  return <RentalForm mode="update" />;
}
