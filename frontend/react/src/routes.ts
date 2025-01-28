import {
  BikeIcon,
  BoltIcon,
  Building2Icon,
  HomeIcon,
  KeyIcon,
  PackageIcon,
  ShieldIcon,
  TriangleAlertIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { Breakdown } from "./pages/Breakdown";
import { Company } from "./pages/Company";
import { Driver } from "./pages/Driver";
import { Guarantee } from "./pages/Guarantee";
import { Home } from "./pages/Home";
import { Maintenance } from "./pages/Maintenance";
import { Model } from "./pages/Model";
import { Motorcycle } from "./pages/Motorcycle";
import { Part } from "./pages/Part";
import { Rental } from "./pages/Rental";
import { CompanyCreate, CompanyUpdate } from "./pages/forms/Company";
import { MotorcycleCreate, MotorcycleUpdate } from "./pages/forms/Motorcycle";
import { DriverCreate, DriverUpdate } from "./pages/forms/Driver";
import { ModelCreate, ModelUpdate } from "./pages/forms/Model";
import { PartCreate, PartUpdate } from "./pages/forms/Part";
import { GuaranteeCreate, GuaranteeUpdate } from "./pages/forms/Guarantee";
import { RentalCreate, RentalUpdate } from "./pages/forms/Rental";
import {
  MaintenanceCreate,
  MaintenanceUpdate,
} from "./pages/forms/Maintenance";
import { MaintenanceParts } from "./pages/MaintenanceParts";

export const routes = [
  {
    title: "Accueil",
    path: "/home",
    icon: HomeIcon,
    element: Home,
  },
  {
    title: "Entreprises",
    path: "/companies",
    icon: Building2Icon,
    element: Company,
    adminOnly: true,
  },
  {
    title: "Modèles",
    path: "/models",
    icon: PackageIcon,
    element: Model,
    adminOnly: true,
  },
  {
    title: "Motos",
    path: "/motorcycles",
    icon: BikeIcon,
    element: Motorcycle,
  },
  {
    title: "Conducteurs",
    path: "/drivers",
    icon: UserIcon,
    element: Driver,
  },
  {
    title: "Locations",
    path: "/rentals",
    icon: KeyIcon,
    element: Rental,
  },
  {
    title: "Pannes",
    path: "/breakdowns",
    icon: TriangleAlertIcon,
    element: Breakdown,
  },
  {
    title: "Entretiens",
    path: "/maintenances",
    icon: WrenchIcon,
    element: Maintenance,
  },
  {
    title: "Garanties",
    path: "/guarantees",
    icon: ShieldIcon,
    element: Guarantee,
    adminOnly: true,
  },
  {
    title: "Pièces",
    path: "/parts",
    icon: BoltIcon,
    element: Part,
    adminOnly: true,
  },
];

export const hiddenRoutes = [
  // Route create en premier, sinon "create" est considéré comme :identifier
  // par la route d'update
  {
    path: "/companies/create",
    element: CompanyCreate,
  },
  {
    path: "/companies/:identifier",
    element: CompanyUpdate,
  },
  {
    path: "/models/create",
    element: ModelCreate,
  },
  {
    path: "/models/:identifier",
    element: ModelUpdate,
  },
  {
    path: "/motorcycles/create",
    element: MotorcycleCreate,
  },
  {
    path: "/motorcycles/:identifier",
    element: MotorcycleUpdate,
  },
  {
    path: "/drivers/create",
    element: DriverCreate,
  },
  {
    path: "/drivers/:identifier",
    element: DriverUpdate,
  },
  {
    path: "/rentals/create",
    element: RentalCreate,
  },
  {
    path: "/rentals/:identifier",
    element: RentalUpdate,
  },
  {
    path: "/parts/create",
    element: PartCreate,
  },
  {
    path: "/parts/:identifier",
    element: PartUpdate,
  },
  {
    path: "/guarantees/create",
    element: GuaranteeCreate,
  },
  {
    path: "/guarantees/:identifier",
    element: GuaranteeUpdate,
  },
  {
    path: "/maintenances/create",
    element: MaintenanceCreate,
  },
  {
    path: "/maintenances/:identifier",
    element: MaintenanceUpdate,
  },
  {
    path: "/maintenances/:identifier/parts",
    element: MaintenanceParts,
  },
];
