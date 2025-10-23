import { Calendar, Heart, Store, Wallet } from "lucide-react";

export const forwardProducts = [
  {
    __typename: "Product",
    id: "666",
    isPublished: true,
    name: "Template 1",
    sku: "Template-1",
    urlImage: "",
    description: "Template 1",
    createdAt: "2025-04-10T09:21:40.043Z",
    discount: 10,
    categories: [
      {
        __typename: "Category",
        id: "2",
        name: "Snowboard",
        children: [
          {
            __typename: "Category",
            id: "2",
            name: "Débutant",
          },
        ],
      },
    ],
    variants: [
      {
        __typename: "Variant",
        pricePerDay: 1500,
      },
      {
        __typename: "Variant",
        pricePerDay: 1100,
      },
    ],
  },
  {
    __typename: "Product",
    id: "667",
    isPublished: true,
    name: "Template 2",
    sku: "Template-2",
    urlImage: "",
    description: "Template 2",
    createdAt: "2025-04-10T09:21:40.043Z",
    discount: 20,
    categories: [
      {
        __typename: "Category",
        id: "2",
        name: "Ski",
        children: [
          {
            __typename: "Category",
            id: "2",
            name: "Medium",
          },
        ],
      },
    ],
    variants: [
      {
        __typename: "Variant",
        pricePerDay: 1000,
      },
      {
        __typename: "Variant",
        pricePerDay: 1000,
      },
    ],
  },
  {
    __typename: "Product",
    id: "668",
    isPublished: true,
    name: "Template 3",
    sku: "Template-3",
    urlImage: "",
    description: "Template 3",
    createdAt: "2025-04-10T09:21:40.043Z",
    discount: 30,
    categories: [
      {
        __typename: "Category",
        id: "2",
        name: "Raquettes",
        children: [
          {
            __typename: "Category",
            id: "2",
            name: "Confirmé",
          },
        ],
      },
    ],
    variants: [
      {
        __typename: "Variant",
        pricePerDay: 1500,
      },
      {
        __typename: "Variant",
        pricePerDay: 1100,
      },
    ],
  },
  {
    __typename: "Product",
    id: "669",
    isPublished: true,
    name: "Template 4",
    sku: "Template-4",
    urlImage: "",
    description: "Template 4",
    createdAt: "2025-04-10T09:21:40.043Z",
    discount: 50,
    categories: [
      {
        __typename: "Category",
        id: "2",
        name: "Ski Alpin",
        children: [
          {
            __typename: "Category",
            id: "2",
            name: "Expert",
          },
        ],
      },
    ],
    variants: [
      {
        __typename: "Variant",
        pricePerDay: 1500,
      },
      {
        __typename: "Variant",
        pricePerDay: 1100,
      },
    ],
  },
];

export const carousselImages = [
  { src: "/image-1.webp", alt: "Montagne couché de soleil" },
  { src: "/image-2.webp", alt: "Montagne enneigée" },
  { src: "/image-3.webp", alt: "Montagne et lac" },
  { src: "/image-4.webp", alt: "Balade vélo" },
  { src: "/image-5.webp", alt: "Kayak sur un lac" },
];

export const rentalProcessSteps = [
  {
    icon: <Calendar className="size-6 text-destructive" />,
    title: "Reservez",
    description: "Réservez vos équipements dans le magasin de votre choix.",
  },
  {
    icon: <Wallet className="size-6 text-destructive" />,
    title: "Payez",
    description:
      "Que ce soit seul ou à plusieurs, payez en ligne ou directement en magasin.",
  },
  {
    icon: <Heart className="size-6 text-destructive" />,
    title: "Profitez",
    description:
      "Profitez de nos équipement de qualité sans vous soucier du reste !",
  },
  {
    icon: <Store className="size-6 text-destructive" />,
    title: "Retournez",
    description: "Retournez les équipements dans le magasin de votre choix.",
  },
];

export const bentoGridSpans = [
  "row-span-2 col-span-3",
  "col-span-3",
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-3",
];

export const activitiesSectionSpans = [
  "col-start-2",
  "col-start-4",
  "col-start-6",
  "col-start-8",
];
