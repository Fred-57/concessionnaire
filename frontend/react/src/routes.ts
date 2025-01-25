import {
  BikeIcon,
  BoltIcon,
  Building2Icon,
  HomeIcon,
  KeyIcon,
  PackageIcon,
  TriangleAlertIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { Breakdown } from "./pages/Breakdown";
import { Company } from "./pages/Company";
import { Driver } from "./pages/Driver";
import { Home } from "./pages/Home";
import { Maintenance } from "./pages/Maintenance";
import { Model } from "./pages/Model";
import { Motorcycle } from "./pages/Motorcycle";
import { Part } from "./pages/Part";
import { Rental } from "./pages/Rental";
import { CompanyCreate, CompanyUpdate } from "./pages/forms/Company";
import { DriverCreate, DriverUpdate } from "./pages/forms/Driver";
import { ModelCreate, ModelUpdate } from "./pages/forms/Model";
import { PartCreate, PartUpdate } from "./pages/forms/Part";

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
  },
  {
    title: "Modèles",
    path: "/models",
    icon: PackageIcon,
    element: Model,
  },
  {
    title: "Motos",
    path: "/bikes",
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
    path: "/maintenance",
    icon: WrenchIcon,
    element: Maintenance,
  },
  {
    title: "Pièces",
    path: "/parts",
    icon: BoltIcon,
    element: Part,
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
    path: "/drivers/create",
    element: DriverCreate,
  },
  {
    path: "/drivers/:identifier",
    element: DriverUpdate,
  },
  {
    path: "/parts/create",
    element: PartCreate,
  },
  {
    path: "/parts/:identifier",
    element: PartUpdate,
  },
];
