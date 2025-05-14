import {
  Activity,
  Boxes,
  FileBox,
  Home,
  Package2,
  ShoppingCart,
  Store,
  Tags,
  Ticket,
  Users2,
  Wallet,
} from "lucide-react";

export interface AdminNavSubItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export interface AdminNavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
  subItems?: AdminNavSubItem[];
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Tableau de bord",
    href: "/admin",
    icon: <Home className={`size-4 flex-none lg:size-5`} />,
    label: "Tableau de bord",
  },
  {
    title: "Activités",
    href: "/admin/activities",
    icon: <Activity className={`size-4 flex-none lg:size-5`} />,
    label: "Activités",
  },
  {
    title: "Catégories",
    href: "/admin/categories",
    icon: <Tags className={`size-4 flex-none lg:size-5`} />,
    label: "Catégories",
  },
  {
    title: "Commandes",
    href: "/admin/orders",
    icon: <FileBox className={`size-4 flex-none lg:size-5`} />,
    label: "Commandes",
  },
  {
    title: "Packs",
    href: "/admin/packs",
    icon: <Boxes className={`size-4 flex-none lg:size-5`} />,
    label: "Packs",
    disabled: true,
  },
  {
    title: "Paiements",
    href: "/admin/payments",
    icon: <Wallet className={`size-4 flex-none lg:size-5`} />,
    label: "Paiements",
  },
  {
    title: "Paniers",
    href: "/admin/carts",
    icon: <ShoppingCart className={`size-4 flex-none lg:size-5`} />,
    label: "Paniers",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: <Package2 className={`size-4 flex-none lg:size-5`} />,
    label: "Products",
  },
  {
    title: "Stores",
    href: "/admin/stores",
    icon: <Store className={`size-4 flex-none lg:size-5`} />,
    label: "Stores",
    disabled: true,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: <Users2 className={`size-4 flex-none lg:size-5`} />,
    label: "Utilisateurs",
  },
  {
    title: "Vouchers",
    href: "/admin/vouchers",
    icon: <Ticket className={`size-4 flex-none lg:size-5`} />,
    label: "Vouchers",
    disabled: true,
  },
];
