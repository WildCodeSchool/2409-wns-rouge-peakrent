import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Variant } from "@/gql/graphql";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { CREATE_VARIANT } from "@/GraphQL/createVariant";
import { UPDATE_VARIANT } from "@/GraphQL/updateVariant";

type VariantFormType = {
  variant?: Variant;
  productId: number;
};

export const VariantForm = ({ variant, productId }: VariantFormType) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [color, setColor] = useState(variant?.color ?? "");
  const [size, setSize] = useState(variant?.size ?? "");
  const [price, setPrice] = useState(variant?.pricePerHour ?? 0);

  const [createVariant] = useMutation(gql(CREATE_VARIANT));
  const [updateVariant] = useMutation(gql(UPDATE_VARIANT));

  console.log(productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      await createVariant({
        variables: {},
      });

      alert("Variant created!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <Button type="submit" disabled={uploading}>
        {uploading ? <LoadIcon size={24} /> : "Create Variant"}
      </Button>
    </form>
  );
};
