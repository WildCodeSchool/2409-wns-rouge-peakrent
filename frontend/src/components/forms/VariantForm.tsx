import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Variant } from "@/gql/graphql";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { CREATE_VARIANT } from "@/GraphQL/createVariant";
import { UPDATE_VARIANT } from "@/GraphQL/updateVariant";
import { toast } from "sonner";
import { useModal } from "@/context/modalProvider";

type VariantFormType = {
  variant?: Variant;
  productId?: number;
  setNewVariants?: React.Dispatch<React.SetStateAction<Partial<Variant>[]>>;
  onClose?: () => void;
};

export const VariantForm = ({
  variant,
  productId,
  setNewVariants,
}: VariantFormType) => {
  const { closeModal } = useModal();
  const [uploading, setUploading] = useState<boolean>(false);
  const [color, setColor] = useState(variant?.color ?? "");
  const [size, setSize] = useState(variant?.size ?? "");
  const [pricePerHour, setPricePerHour] = useState(variant?.pricePerHour ?? 0);

  const [createVariant] = useMutation(gql(CREATE_VARIANT));
  const [updateVariant] = useMutation(gql(UPDATE_VARIANT));

  const handleVariantFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const isNew = !productId && setNewVariants;

    try {
      const commonData = {
        productId,
        color,
        size,
        pricePerHour,
      };
      if (isNew) {
        setNewVariants((prevVariants) => [...prevVariants, commonData]);
        toast.success("Variant ajouté localement !");
        closeModal();
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
        closeModal();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleVariantFormSubmit}>
      <Input
        type="text"
        placeholder="Variant color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Variant size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Price per hour"
        value={pricePerHour}
        onChange={(e) => setPricePerHour(Number(e.target.value))}
      />

      <Button type="submit" disabled={uploading}>
        {uploading ? (
          <LoadIcon size={24} />
        ) : variant?.id ? (
          "Modifier le variant"
        ) : (
          "Créer le variant"
        )}
      </Button>
    </form>
  );
};
