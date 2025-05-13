import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        none: "border-transparent bg-transparent text-foreground justify-center",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Rouge
        red: "border-red-900 bg-red-300 text-red-900",
        redLight: "border-red-100 bg-red-50 text-red-900",
        redDark: "border-red-800 bg-red-600 text-red-50",

        // Vert
        green: "border-green-900 bg-green-300 text-green-900",
        greenLight: "border-green-100 bg-green-50 text-green-900",
        greenDark: "border-green-800 bg-green-600 text-green-50",

        // Jaune
        yellow: "border-yellow-900 bg-yellow-300 text-yellow-900",
        yellowLight: "border-yellow-100 bg-yellow-50 text-yellow-900",
        yellowDark: "border-yellow-800 bg-yellow-600 text-yellow-50",

        // Bleu
        blue: "border-blue-900 bg-blue-300 text-blue-900",
        blueLight: "border-blue-100 bg-blue-50 text-blue-900",
        blueDark: "border-blue-800 bg-blue-600 text-blue-50",

        // Rose
        pink: "border-pink-900 bg-pink-300 text-pink-900",
        pinkLight: "border-pink-100 bg-pink-50 text-pink-900",
        pinkDark: "border-pink-800 bg-pink-600 text-pink-50",

        // Violet
        purple: "border-purple-900 bg-purple-300 text-purple-900",
        purpleLight: "border-purple-100 bg-purple-50 text-purple-900",
        purpleDark: "border-purple-800 bg-purple-600 text-purple-50",

        // Indigo
        indigo: "border-indigo-900 bg-indigo-300 text-indigo-900",
        indigoLight: "border-indigo-100 bg-indigo-50 text-indigo-900",
        indigoDark: "border-indigo-800 bg-indigo-600 text-indigo-50",

        // Cyan
        cyan: "border-cyan-900 bg-cyan-300 text-cyan-900",
        cyanLight: "border-cyan-100 bg-cyan-50 text-cyan-900",
        cyanDark: "border-cyan-800 bg-cyan-600 text-cyan-50",

        // Teal
        teal: "border-teal-900 bg-teal-300 text-teal-900",
        tealLight: "border-teal-100 bg-teal-50 text-teal-900",
        tealDark: "border-teal-800 bg-teal-600 text-teal-50",

        // Blanc et noir
        white: "border-black bg-white text-black",
        black: "border-black bg-primary/30 text-black dark:bg-primary/60",

        // Orange
        orange: "border-orange-900 bg-orange-300 text-orange-900",
        orangeLight: "border-orange-100 bg-orange-50 text-orange-900",
        orangeDark: "border-orange-800 bg-orange-600 text-orange-50",

        // Émeraude
        emerald: "border-emerald-900 bg-emerald-300 text-emerald-900",
        emeraldLight: "border-emerald-100 bg-emerald-50 text-emerald-900",
        emeraldDark: "border-emerald-800 bg-emerald-600 text-emerald-50",

        // Lime
        lime: "border-lime-900 bg-lime-300 text-lime-900",
        limeLight: "border-lime-100 bg-lime-50 text-lime-900",
        limeDark: "border-lime-800 bg-lime-600 text-lime-50",

        // Ambre
        amber: "border-amber-900 bg-amber-300 text-amber-900",
        amberLight: "border-amber-100 bg-amber-50 text-amber-900",
        amberDark: "border-amber-800 bg-amber-600 text-amber-50",

        // Rose
        rose: "border-rose-900 bg-rose-300 text-rose-900",
        roseLight: "border-rose-100 bg-rose-50 text-rose-900",
        roseDark: "border-rose-800 bg-rose-600 text-rose-50",

        // Fuchsia
        fuchsia: "border-fuchsia-900 bg-fuchsia-300 text-fuchsia-900",
        fuchsiaLight: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-900",
        fuchsiaDark: "border-fuchsia-800 bg-fuchsia-600 text-fuchsia-50",

        // Violet
        violet: "border-violet-900 bg-violet-300 text-violet-900",
        violetLight: "border-violet-100 bg-violet-50 text-violet-900",
        violetDark: "border-violet-800 bg-violet-600 text-violet-50",

        // Gris chaud
        warmGray: "border-warmGray-900 bg-warmGray-500 text-white",
        warmGrayLight: "border-warmGray-100 bg-warmGray-300 text-warmGray-900",
        warmGrayDark: "border-warmGray-800 bg-warmGray-700 text-white",

        // Gris frais
        coolGray: "border-coolGray-900 bg-coolGray-500 text-white",
        coolGrayLight: "border-coolGray-100 bg-coolGray-300 text-coolGray-900",
        coolGrayDark: "border-coolGray-800 bg-coolGray-700 text-white",

        // Vrai gris
        trueGray: "border-trueGray-900 bg-trueGray-500 text-white",
        trueGrayLight: "border-trueGray-100 bg-trueGray-300 text-trueGray-900",
        trueGrayDark: "border-trueGray-800 bg-trueGray-700 text-white",

        // Gris bleu
        blueGray: "border-blueGray-900 bg-blueGray-500 text-white",
        blueGrayLight: "border-blueGray-100 bg-blueGray-300 text-blueGray-900",
        blueGrayDark: "border-blueGray-800 bg-blueGray-700 text-white",

        // Pierre
        stone: "border-stone-900 bg-stone-300 text-stone-900",
        stoneLight: "border-stone-100 bg-stone-50 text-stone-900",
        stoneDark: "border-stone-800 bg-stone-600 text-stone-50",

        // Zinc
        zinc: "border-zinc-900 bg-zinc-300 text-zinc-900",
        zincLight: "border-zinc-100 bg-zinc-50 text-zinc-900",
        zincDark: "border-zinc-800 bg-zinc-600 text-zinc-50",

        // Neutre
        neutral: "border-neutral-900 bg-neutral-300 text-neutral-900",
        neutralLight: "border-neutral-100 bg-neutral-50 text-neutral-900",
        neutralDark: "border-neutral-800 bg-neutral-600 text-neutral-50",

        // Ardoise
        slate: "border-slate-900 bg-slate-300 text-slate-900",
        slateLight: "border-slate-100 bg-slate-50 text-slate-900",
        slateDark: "border-slate-800 bg-slate-600 text-slate-50",

        // Ciel
        sky: "border-sky-900 bg-sky-300 text-sky-900",
        skyLight: "border-sky-200 bg-sky-100 text-sky-900",
        skyDark: "border-sky-800 bg-sky-600 text-white",

        // Olive
        olive: "border-olive-900 bg-olive-500 text-stone-900",
        oliveLight: "border-olive-100 bg-olive-300 text-olive-900",
        oliveDark: "border-olive-800 bg-olive-700 text-white",

        // Marron
        maroon: "border-maroon-900 bg-maroon-500 text-white",
        maroonLight: "border-maroon-100 bg-maroon-300 text-maroon-900",
        maroonDark: "border-maroon-800 bg-maroon-700 text-white",

        // Lavande
        lavender: "border-lavender-900 bg-lavender-500 text-white",
        lavenderLight: "border-lavender-100 bg-lavender-300 text-lavender-900",
        lavenderDark: "border-lavender-800 bg-lavender-700 text-white",

        //Turquoise
        turquoise: "border-turquoise-900 bg-turquoise-500 text-white",
        turquoiseLight:
          "border-turquoise-100 bg-turquoise-300 text-turquoise-900",
        turquoiseDark: "border-turquoise-800 bg-turquoise-700 text-white",

        // Or
        gold: "border-gold-900 bg-gold-500 text-white",
        goldLight: "border-gold-100 bg-gold-300 text-gold-900",
        goldDark: "border-gold-800 bg-gold-700 text-white",

        // Platine
        platinum: "border-platinum-900 bg-platinum-500 text-white",
        platinumLight: "border-platinum-100 bg-platinum-300 text-platinum-900",
        platinumDark: "border-platinum-800 bg-platinum-700 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const badgeVariantList = [
  "default",
  "secondary",
  "destructive",
  "redLight",
  "red",
  "redDark",
  "greenLight",
  "green",
  "greenDark",
  "yellowLight",
  "yellow",
  "yellowDark",
  "blueLight",
  "blue",
  "blueDark",
  "pinkLight",
  "pink",
  "pinkDark",
  "purpleLight",
  "purple",
  "purpleDark",
  "indigoLight",
  "indigo",
  "indigoDark",
  "cyanLight",
  "cyan",
  "cyanDark",
  "tealLight",
  "teal",
  "tealDark",
  "white",
  "black",
  "none",
  "orangeLight",
  "orange",
  "orangeDark",
  "emeraldLight",
  "emerald",
  "emeraldDark",
  "limeLight",
  "lime",
  "limeDark",
  "amberLight",
  "amber",
  "amberDark",
  "roseLight",
  "rose",
  "roseDark",
  "fuchsiaLight",
  "fuchsia",
  "fuchsiaDark",
  "violetLight",
  "violet",
  "violetDark",
  "warmGrayLight",
  "warmGray",
  "warmGrayDark",
  "coolGrayLight",
  "coolGray",
  "coolGrayDark",
  "trueGrayLight",
  "trueGray",
  "trueGrayDark",
  "blueGrayLight",
  "blueGray",
  "blueGrayDark",
  "stoneLight",
  "stone",
  "stoneDark",
  "zincLight",
  "zinc",
  "zincDark",
  "neutralLight",
  "neutral",
  "neutralDark",
  "slateLight",
  "slate",
  "slateDark",
  "skyLight",
  "sky",
  "skyDark",
  "oliveLight",
  "olive",
  "oliveDark",
  "maroonLight",
  "maroon",
  "maroonDark",
  "lavenderLight",
  "lavender",
  "lavenderDark",
  "turquoiseLight",
  "turquoise",
  "turquoiseDark",
  "goldLight",
  "gold",
  "goldDark",
  "platinumLight",
  "platinum",
  "platinumDark",
] as const;

export type BadgeVariantType = (typeof badgeVariantList)[number];

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
