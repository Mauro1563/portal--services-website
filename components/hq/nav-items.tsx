import {
  LayoutDashboard,
  FileText,
  Globe,
  Palette,
  LayoutGrid,
  Users,
  TrendingUp,
  FileSignature,
  Inbox,
  Settings,
  Eye,
} from 'lucide-react';

export type Active =
  | 'dashboard'
  | 'vistas'
  | 'content'
  | 'site'
  | 'branding'
  | 'portals'
  | 'clients'
  | 'sales'
  | 'contracts'
  | 'leads'
  | 'settings';

export const navGroups: {
  label: string;
  items: { key: Active; href: string; label: string; Icon: typeof FileText }[];
}[] = [
  {
    label: 'General',
    items: [
      { key: 'dashboard', href: '/hq', label: 'Dashboard', Icon: LayoutDashboard },
      { key: 'vistas', href: '/hq/vistas', label: 'Vistas / Preview', Icon: Eye },
    ],
  },
  {
    label: 'Sitio',
    items: [
      { key: 'site', href: '/hq/site', label: 'Textos y precios', Icon: Globe },
      { key: 'content', href: '/hq/content', label: 'Contenido (clásico)', Icon: FileText },
      { key: 'branding', href: '/hq/branding', label: 'Branding', Icon: Palette },
      { key: 'portals', href: '/hq/portals', label: 'Portales', Icon: LayoutGrid },
    ],
  },
  {
    label: 'Negocio',
    items: [
      { key: 'clients', href: '/hq/clients', label: 'Clientes', Icon: Users },
      { key: 'sales', href: '/hq/sales', label: 'Ventas', Icon: TrendingUp },
      { key: 'contracts', href: '/hq/contracts', label: 'Contratos', Icon: FileSignature },
      { key: 'leads', href: '/hq/leads', label: 'Leads', Icon: Inbox },
    ],
  },
  {
    label: 'Sistema',
    items: [{ key: 'settings', href: '/hq/settings', label: 'Ajustes', Icon: Settings }],
  },
];
