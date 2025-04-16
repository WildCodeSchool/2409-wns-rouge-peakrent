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
        pricePerHour: 1500,
      },
      {
        __typename: "Variant",
        pricePerHour: 1100,
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
        pricePerHour: 1000,
      },
      {
        __typename: "Variant",
        pricePerHour: 1000,
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
        pricePerHour: 1500,
      },
      {
        __typename: "Variant",
        pricePerHour: 1100,
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
        pricePerHour: 1500,
      },
      {
        __typename: "Variant",
        pricePerHour: 1100,
      },
    ],
  },
];

export const carousselImages = [
  { src: "/image-1.png", alt: "Slide 1" },
  { src: "/image-2.png", alt: "Slide 2" },
  { src: "/image-3.png", alt: "Slide 3" },
  { src: "/image-4.png", alt: "Slide 4" },
  { src: "/image-5.png", alt: "Slide 5" },
];

export const homeActivities = [
  {
    id: 1,
    title: "Activité 1",
    description: "Description de l'activité 1",
    image: "/image-1.png",
    span: "row-span-2 col-span-3",
  },
  {
    id: 2,
    title: "Activité 2",
    description: "Description de l'activité 2",
    image: "/image-2.png",
    span: "col-span-3",
  },
  {
    id: 3,
    title: "Activité 3",
    description: "Description de l'activité 3",
    image: "/image-3.png",
    span: "col-span-2",
  },
  {
    id: 4,
    title: "Activité 4",
    description: "Description de l'activité 4",
    image: "/image-1.png",
    span: "col-span-2",
  },
  {
    id: 5,
    title: "Activité 5",
    description: "Description de l'activité 5",
    image: "/image-2.png",
    span: "col-span-2",
  },
  {
    id: 6,
    title: "Activité 6",
    description: "Description de l'activité 6",
    image: "/image-3.png",
    span: "col-span-2",
  },
  {
    id: 7,
    title: "Activité 7",
    description: "Description de l'activité 7",
    image: "/image-3.png",
    span: "col-span-3",
  },
  {
    id: 8,
    title: "Activité 8",
    description: "Description de l'activité 8",
    image: "/image-3.png",
    span: "col-span-2",
  },
  {
    id: 9,
    title: "Activité 9",
    description: "Description de l'activité 9",
    image: "/image-3.png",
    span: "col-span-3",
  },
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
