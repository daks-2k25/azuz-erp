import {
  Camera,
  FileImage,
  LayoutTemplate,
  Megaphone,
  MoreHorizontal,
  Share2,
  type LucideIcon,
} from "lucide-react";
import type { PortalRequestContentType } from "@/services/types";

export interface PortalRequestContentTypeOption {
  id: PortalRequestContentType;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PORTAL_REQUEST_CONTENT_TYPES: PortalRequestContentTypeOption[] = [
  {
    id: "rede_social",
    label: "Rede Social",
    description: "Posts, stories e conteúdo digital",
    icon: Share2,
  },
  {
    id: "flyer",
    label: "Flyer",
    description: "Arte promocional para impressão ou digital",
    icon: FileImage,
  },
  {
    id: "panfleto",
    label: "Panfleto",
    description: "Material informativo dobrável",
    icon: Megaphone,
  },
  {
    id: "banner",
    label: "Banner",
    description: "Peça visual para eventos ou pontos de venda",
    icon: LayoutTemplate,
  },
  {
    id: "ensaio_fotografico",
    label: "Ensaio Fotográfico",
    description: "Sessão de fotos e cobertura visual",
    icon: Camera,
  },
  {
    id: "outro",
    label: "Outro",
    description: "Formato personalizado ou mídia específica",
    icon: MoreHorizontal,
  },
];

export const PORTAL_REQUEST_CONTENT_TYPE_LABELS: Record<
  PortalRequestContentType,
  string
> = {
  rede_social: "Rede Social",
  flyer: "Flyer",
  panfleto: "Panfleto",
  banner: "Banner",
  ensaio_fotografico: "Ensaio Fotográfico",
  outro: "Outro",
};
