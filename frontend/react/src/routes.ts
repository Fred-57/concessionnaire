import {
  BikeIcon,
  BoltIcon,
  HomeIcon,
  KeyIcon,
  PackageIcon,
  TriangleAlertIcon,
  UserIcon,
  WrenchIcon,
} from "lucide-react";
import { Breakdown } from "./pages/Breakdown";
import { Driver } from "./pages/Driver";
import { Home } from "./pages/Home";
import { Maintenance } from "./pages/Maintenance";
import { Model } from "./pages/Model";
import { Motorcycle } from "./pages/Motorcycle";
import { Part } from "./pages/Part";
import { Rental } from "./pages/Rental";

export const routes = [
  {
    title: "Accueil",
    path: "/home",
    icon: HomeIcon,
    element: Home,
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
