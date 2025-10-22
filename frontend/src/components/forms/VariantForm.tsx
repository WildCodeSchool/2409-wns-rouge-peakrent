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
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "../ui";
import {
  MultipleSelectorInput,
  Price,
  Quantity,
  SingleSelectorInput,
  StringInput,
} from "./formField";
import { sizeGroups } from "./formField/select/options/sizeOptions";
import { getFormDefaultValues } from "./utils/getFormDefaultValues";

type VariantFormType = {
  variant?: Partial<Variant>;
  productId?: number;
  setNewVariants?: Dispatch<SetStateAction<ProductFormSchema["variants"]>>;
  refetchProduct?: () => Promise<ApolloQueryResult<Product>>;
  existingPairs?: { color: string; size: string }[];
};

export const VariantForm = ({
  variant,
  productId,
  setNewVariants,
  refetchProduct,
  existingPairs = [],
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

  const normalizedPairs = useMemo(() => {
    const set = new Set<string>();
    for (const p of existingPairs) {
      const key = `${(p.color || "").toLowerCase()}__${(p.size || "").toLowerCase()}`;
      set.add(key);
    }
    return set;
  }, [existingPairs]);

  const {
    data: getVariantsData,
    loading: loadingVariants,
    error: errorVariants,
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

  // Filter size options based on selected color to avoid duplicates (color+size)
  const selectedColor = form.watch("color") as string | undefined;
  const selectedColorLower = (selectedColor || "").toLowerCase();
  const filteredSizeGroups = useMemo(() => {
    const disallowed = new Set<string>();
    for (const p of existingPairs) {
      if ((p.color || "").toLowerCase() === selectedColorLower) {
        disallowed.add((p.size || "").toLowerCase());
      }
    }
    // Allow currently edited size when editing and color matches
    if (isEdit) {
      const currentColorLower = (variant?.color || "").toLowerCase();
      const currentSizeLower = (variant?.size || "").toLowerCase();
      if (currentColorLower === selectedColorLower && currentSizeLower) {
        disallowed.delete(currentSizeLower);
      }
    }
    return sizeGroups.map((group) => ({
      ...group,
      options: group.options.filter(
        (opt: { label: string; value: string }) =>
          !disallowed.has((opt.value || opt.label || "").toLowerCase())
      ),
    }));
  }, [
    existingPairs,
    selectedColorLower,
    isEdit,
    variant?.color,
    variant?.size,
  ]);

  // When color changes, clear sizes to avoid stale selections (but not on initial mount)
  const prevColorLowerRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (prevColorLowerRef.current === undefined) {
      prevColorLowerRef.current = selectedColorLower;
      return;
    }
    if (prevColorLowerRef.current !== selectedColorLower) {
      form.setValue("sizes", [] as any);
      prevColorLowerRef.current = selectedColorLower;
    }
  }, [selectedColorLower]);

  const onSubmit = async (values: VariantCreateSchema) => {
    setUploading(true);
    try {
      const priceInCents = Math.round((Number(values.pricePerDay) || 0) * 100);

      const color = (values.color || "").toLowerCase();
      let incoming;

      if (Array.isArray(values.sizes)) {
        incoming = values.sizes.length > 0 ? values.sizes : [""];
      } else if (values.sizes) {
        incoming = [values.sizes];
      } else {
        incoming = [""];
      }
      const filteredSizes = incoming?.filter((s) => {
        const sLower = (s || "").toLowerCase();
        // Allow current pair during edit so it's not skipped
        if (isEdit) {
          const currentColorLower = (variant?.color || "").toLowerCase();
          const currentSizeLower = (variant?.size || "").toLowerCase();
          if (color === currentColorLower && sLower === currentSizeLower) {
            return true;
          }
        }
        return !normalizedPairs.has(`${color}__${sLower}`);
      });
      const skipped = incoming.length - filteredSizes.length;

      const results = await Promise.all(
        filteredSizes.map(async (size) => {
          try {
            const commonData = {
              productId,
              color: values.color,
              size,
              pricePerDay: priceInCents,
              quantity: values.quantity,
            } as const;

            if (isNewLocalVariant) {
              setNewVariants!((prev) => [
                ...prev,
                { ...commonData, isPublished: true },
              ]);
              return true;
            }

            if (variant?.id) {
              await updateVariant({
                variables: {
                  updateVariantId: variant.id,
                  data: commonData,
                },
              });
            } else {
              await createVariant({
                variables: {
                  data: commonData,
                },
              });
            }
            return true;
          } catch {
            return false;
          }
        })
      );

      const success = results.filter(Boolean).length;
      const failed = results.length - success;

      const messages: string[] = [];
      if (skipped > 0)
        messages.push(
          `${skipped} combinaison(s) ignorée(s) (couleur+taille déjà présente)`
        );
      messages.push(`${success} réussite(s), ${failed} échec(s)`);

      const message = messages.join(" • ");
      if (failed > 0 || skipped > 0) toast.error(message);
      else toast.success(message);

      if (refetchProduct) await refetchProduct();
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue.");
    } finally {
      setUploading(false);
    }
  };

  const sizesDisabled = !selectedColor || selectedColor.trim() === "";

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
                isPending={uploading || sizesDisabled}
                placeholder="Ex: S"
                className="h-10"
                required
              />
            ) : (
              <MultipleSelectorInput
                form={form}
                name="sizes"
                label="Taille"
                groups={filteredSizeGroups}
                isPending={uploading || sizesDisabled}
                placeholder={
                  sizesDisabled
                    ? "Choisir une couleur d'abord"
                    : "Sélectionner une taille"
                }
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
              isPending={uploading || sizesDisabled}
              placeholder={
                sizesDisabled
                  ? "Choisir une couleur d'abord"
                  : "Ex: S, M, L, XL"
              }
              required
              className="h-10"
            />
          ) : (
            <MultipleSelectorInput
              form={form}
              name="sizes"
              label="Taille"
              groups={filteredSizeGroups}
              isPending={uploading || sizesDisabled}
              placeholder={
                sizesDisabled
                  ? "Choisir une couleur d'abord"
                  : "Sélectionner les tailles"
              }
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
        <Quantity
          form={form}
          isPending={uploading}
          containerClassName="border-0 w-full max-w-full p-0 h-fit gap-1"
          itemClassName="flex-col w-full items-start"
          label="Quantité"
          inputClassName="w-full max-w-full h-10"
          buttonsClassName="bg-primary/70 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 p-2 hover:ring-0 "
          dozenClassName="bg-primary/90 text-primary-foreground disabled:bg-primary/10 disabled:text-primary-foreground hover:bg-primary min-w-12 p-2 hover:ring-0 "
          withDozen
          max={9999}
        />

        {/* Bouton Submit */}
        <Button
          type="submit"
          disabled={uploading || sizesDisabled}
          className="mt-4 w-full"
        >
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
