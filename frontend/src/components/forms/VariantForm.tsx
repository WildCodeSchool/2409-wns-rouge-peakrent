import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalProvider";
import { Product, Variant } from "@/gql/graphql";
import {
  CREATE_VARIANT,
  GET_VARIANTS,
  UPDATE_VARIANT,
} from "@/graphQL/variants";
import { ProductFormSchema } from "@/schemas/productSchemas";
import {
  variantCreateSchema,
  VariantCreateSchema,
} from "@/schemas/variantSchemas";
import { ApolloQueryResult, gql, useMutation, useQuery } from "@apollo/client";
import { MoreHorizontal } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "../ui";
import {
  MultipleSelectorInput,
  Price,
  SingleSelectorInput,
  StringInput,
} from "./formField";
import { sizeGroups } from "./formField/select/options/sizeOptions";
import { getFormDefaultValues } from "./utils/getFormDefaultValues";

type VariantFormType = {
  variant?: Variant;
  productId?: number;
  setNewVariants?: Dispatch<SetStateAction<ProductFormSchema["variants"]>>;
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
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSizesInput, setCustomSizesInput] = useState<string>(
    variant?.size ? variant.size : ""
  );

  const formSchema = variantCreateSchema(variant);
  const defaultValues = getFormDefaultValues(formSchema);
  const form = useForm<VariantCreateSchema>({ defaultValues });

  const [createVariant] = useMutation(gql(CREATE_VARIANT));
  const [updateVariant] = useMutation(gql(UPDATE_VARIANT));

  const isEdit = Boolean(variant?.id);
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
          getVariantsData.getVariants
            .map((v: Variant) => v.color)
            .filter(Boolean)
        )
      ) as string[];
      setAvailableColors(colors);
      const sizes: string[] = Array.from(
        new Set(
          getVariantsData.getVariants
            .map((v: Variant) => v.size)
            .filter(Boolean)
        )
      ) as string[];
      setAvailableSizes(sizes);
    }
  }, [getVariantsData]);

  const onSubmit = async (values: VariantCreateSchema) => {
    setUploading(true);
    try {
      const priceInCents = Math.round((Number(values.pricePerDay) || 0) * 100);

      const selectedSizes =
        values.sizes && values.sizes.length > 0 ? values.sizes : [""];
      const tasks = selectedSizes.map(async (size) => {
        const commonData = {
          productId,
          color: values.color,
          size,
          pricePerDay: priceInCents,
        } as const;

        if (isNewLocalVariant) {
          setNewVariants!((prev) => [
            ...prev,
            { ...commonData, isPublished: true },
          ]);
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
      if (refetchProduct) await refetchProduct();
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4"
      >
        {/* Couleur */}
        <div className="flex flex-col gap-2 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsCustomColor((prev) => !prev)}
            className="absolute right-0 -top-4 hover:bg-transparent group"
          >
            <MoreHorizontal
              size={20}
              className="text-muted-foreground group-hover:font-bold group-hover:text-foreground"
            />
          </Button>
          {isCustomColor ? (
            <StringInput
              label="Couleur"
              form={form}
              name="color"
              isPending={uploading}
              placeholder="Ex: Rouge, Bleu, Vert"
              className="h-10"
              required
            />
          ) : (
            <SingleSelectorInput
              options={availableColors.map((color) => ({
                label: color ?? "",
                value: color ?? "",
              }))}
              form={form}
              name="color"
              label="Couleur"
              isPending={uploading}
              placeholder="Couleur"
              required
            />
          )}
        </div>

        {/* Tailles */}
        <div className="flex flex-col gap-2 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setIsCustomSize((prev) => {
                const next = !prev;
                if (next)
                  setCustomSizesInput(
                    (form.getValues("sizes") || []).join(", ")
                  );
                return next;
              })
            }
            className="absolute right-0 -top-4 hover:bg-transparent group"
          >
            <MoreHorizontal
              size={20}
              className="text-muted-foreground group-hover:font-bold group-hover:text-foreground"
            />
          </Button>

          {/* Edit mode: single select or single custom input */}
          {isEdit ? (
            isCustomSize ? (
              <StringInput
                label="Taille"
                form={form}
                name="sizes"
                isPending={uploading}
                placeholder="Ex: S"
                className="h-10"
                required
              />
            ) : (
              <MultipleSelectorInput
                form={form}
                name="sizes"
                label="Taille"
                groups={sizeGroups}
                isPending={uploading}
                placeholder="Sélectionner une taille"
                maxSelections={1}
                columns={4}
                enableSelectAll
                required
              />
            )
          ) : // Create mode: multiselect or multi custom input
          isCustomSize ? (
            <StringInput
              label="Taille"
              form={form}
              name="sizes"
              isPending={uploading}
              placeholder="Ex: S, M, L, XL"
              required
              className="h-10"
            />
          ) : (
            <MultipleSelectorInput
              form={form}
              name="sizes"
              label="Taille"
              groups={sizeGroups}
              isPending={uploading}
              placeholder="Sélectionner les tailles"
              maxSelections={50}
              columns={4}
              enableSelectAll
              required
            />
          )}
        </div>

        {/* Prix par jour (en €) */}
        <Price
          form={form}
          isPending={uploading}
          name="pricePerDay"
          label="Prix par jour"
          withCents
          required
        />

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
    </Form>
  );
};
