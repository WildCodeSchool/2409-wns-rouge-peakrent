import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/context/modalProvider";
import { Product, Variant } from "@/gql/graphql";
import {
  CREATE_VARIANT,
  GET_VARIANTS,
  UPDATE_VARIANT,
} from "@/graphQL/variants";
import { ApolloQueryResult, gql, useMutation, useQuery } from "@apollo/client";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { MultiSelect } from "../ui/multiple-selector";

type VariantFormType = {
  variant?: Variant;
  productId?: number;
  setNewVariants?: React.Dispatch<React.SetStateAction<Partial<Variant>[]>>;
  refetchProduct?: () => Promise<ApolloQueryResult<Product>>;
};

export const VariantForm = ({
  variant,
  productId,
  setNewVariants,
  refetchProduct,
}: VariantFormType) => {
  const { closeModal } = useModal();
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [color, setColor] = useState<string>(variant?.color ?? "");
  const [sizes, setSizes] = useState<string[]>(
    variant?.size ? [variant.size] : []
  );
  const [pricePerHour, setPricePerHour] = useState(variant?.pricePerHour ?? 0);

  const [createVariant] = useMutation(gql(CREATE_VARIANT));
  const [updateVariant] = useMutation(gql(UPDATE_VARIANT));

  const [isCustomColor, setIsCustomColor] = useState(false);
  const [isCustomSize, setIsCustomSize] = useState(false);

  const isNewLocalVariant = !productId && setNewVariants;

  const {
    data: getVariantsData,
    loading: loadingVariants,
    error: errorVariants,
    refetch,
  } = useQuery(gql(GET_VARIANTS));

  useEffect(() => {
    if (getVariantsData?.getVariants) {
      const colors: string[] = Array.from(
        new Set(
          getVariantsData.getVariants.map((variant: Variant) => variant.color)
        )
      );
      setAvailableColors(colors);
      const sizes: string[] = Array.from(
        new Set(
          getVariantsData.getVariants.map((variant: Variant) => variant.size)
        )
      );
      setAvailableSizes(sizes);
    }
  }, [getVariantsData]);

  const handleVariantFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const tasks = sizes.map(async (size) => {
        const commonData = {
          productId,
          color,
          size,
          pricePerHour,
        };

        if (isNewLocalVariant) {
          setNewVariants((prevVariants) => [...prevVariants, commonData]);
          toast.success("Variant ajouté avec succès !");
        } else {
          if (variant?.id) {
            await updateVariant({
              variables: {
                updateVariantId: variant.id,
                data: commonData,
              },
            });
            toast.success("Variant modifié avec succès !");
          } else {
            await createVariant({
              variables: {
                data: commonData,
              },
            });
            toast.success("Variant créé avec succès !");
          }
        }
      });

      await Promise.all(tasks);

      if (refetchProduct) {
        await refetchProduct();
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleVariantFormSubmit}
      className="flex flex-col gap-6 p-4"
    >
      {/* Couleur */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Couleur :</Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsCustomColor((prev) => !prev)}
          >
            <MoreHorizontal size={20} className="text-muted-foreground" />
          </Button>
        </div>
        {isCustomColor ? (
          <Input
            type="text"
            placeholder="Ex: Rouge, Bleu, Vert"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        ) : (
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>
              Choisir une couleur
            </option>
            {loadingVariants ? (
              <option disabled>Chargement...</option>
            ) : errorVariants ? (
              <option disabled>Erreur de chargement</option>
            ) : (
              availableColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))
            )}
          </select>
        )}
      </div>

      {/* Taille */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Tailles :</Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsCustomSize((prev) => !prev)}
          >
            <MoreHorizontal size={20} className="text-muted-foreground" />
          </Button>
        </div>
        {isCustomSize ? (
          <Input type="text" placeholder="Ex: S, M, L, XL" required />
        ) : (
          <div className="w-full">
            {loadingVariants ? (
              <p className="text-sm text-muted-foreground">
                Chargement des tailles...
              </p>
            ) : errorVariants ? (
              <p className="text-sm text-destructive">Erreur de chargement.</p>
            ) : (
              <MultiSelect
                options={availableSizes.map((size) => ({
                  label: size ?? "",
                  value: size ?? "",
                }))}
                defaultValue={sizes}
                onValueChange={(newSelected) => setSizes(newSelected)}
                placeholder="Sélectionner les tailles"
                maxCount={5}
                enableSelectAll={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Prix par heure */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Prix par heure :</Label>
        <Input
          type="number"
          placeholder="Ex: 10"
          value={pricePerHour}
          onChange={(e) => setPricePerHour(Number(e.target.value))}
          required
          min={0}
        />
      </div>

      {/* Bouton Submit */}
      <Button type="submit" disabled={uploading} className="mt-4 w-full">
        {uploading ? (
          <LoadIcon size={20} className="animate-spin" />
        ) : variant?.id ? (
          "Modifier le variant"
        ) : (
          "Créer le variant"
        )}
      </Button>
    </form>
  );
};
