import { LoadIcon } from "@/components/icons/LoadIcon";
import placeholderImage from "@/components/icons/emptyImage2.svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Activity, Category, Product, Variant } from "@/gql/graphql";
import { GET_ACTIVITIES } from "@/graphQL/activities";
import { GET_CATEGORIES } from "@/graphQL/categories";
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_WITH_VARIANT,
  GET_PRODUCT_BY_ID,
  UPDATE_PRODUCT,
} from "@/graphQL/products";
import { DELETE_VARIANT, TOGGLE_VARIANT_PUBLICATION } from "@/graphQL/variants";
import { cn } from "@/lib/utils";
import {
  productFormSchema,
  type ProductFormSchema,
} from "@/schemas/productSchemas";
import { uploadImage } from "@/utils/uploadImages";
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CreateButton from "../buttons/CreateButton";
import DeleteButton from "../buttons/DeleteButton";
import UpdateButton from "../buttons/UpdateButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  Separator,
  Switch,
} from "../ui";
import FileUploaderInput from "../ui/FileUploaderInput";
import ProductHeader from "./ProductHeader";
import { VariantForm } from "./VariantForm";
import { StringInput, SwitchInput, TextAreaInput } from "./formField";
import { getFormDefaultValues } from "./utils/getFormDefaultValues";

export const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: getProductData,
    loading: loadingProduct,
    error: errorProduct,
    refetch,
  } = useQuery(gql(GET_PRODUCT_BY_ID), {
    variables: { param: id },
    skip: !id,
  });

  const {
    data: getCategoriesData,
    loading: loadingCategories,
    error: errorCategories,
  } = useQuery(gql(GET_CATEGORIES), {
    variables: {
      data: {
        page: 1,
        onPage: 1000,
        sort: "id",
        order: "ASC",
        onlyParent: true,
      },
    },
  });

  const {
    data: getActivitiesData,
    loading: loadingActivities,
    error: errorActivities,
  } = useQuery(gql(GET_ACTIVITIES), {
    variables: {
      data: {
        page: 1,
        onPage: 1000,
        sort: "id",
        order: "ASC",
      },
    },
  });

  const [updateProduct] = useMutation(gql(UPDATE_PRODUCT));
  const [createProduct] = useMutation(gql(CREATE_PRODUCT));
  const [createProductWithVariant] = useMutation(
    gql(CREATE_PRODUCT_WITH_VARIANT)
  );
  const [deleteVariantMutation] = useMutation(gql(DELETE_VARIANT));
  const [toggleVariantPublication] = useMutation(
    gql(TOGGLE_VARIANT_PUBLICATION)
  );

  const product: Product | null = getProductData?.getProductById;

  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [initialVariants, setInitialVariants] = useState<
    ProductFormSchema["variants"]
  >([]);
  const [variants, setVariants] = useState<ProductFormSchema["variants"]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [removeImage, setRemoveImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formSchema = productFormSchema(product);
  const defaultValues = getFormDefaultValues(formSchema);
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const displayedVariants = product?.id
    ? product?.variants || []
    : variants || [];

  const watchedImage = form.watch("image");

  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
    if (getActivitiesData?.getActivities?.activities) {
      setActivities(getActivitiesData.getActivities.activities);
    }
  }, [getCategoriesData, getActivitiesData]);

  useEffect(() => {
    form.setValue("variants", variants);
  }, [variants]);

  useEffect(() => {
    const mappedVariants: ProductFormSchema["variants"] =
      product?.variants?.map((variant) => ({
        pricePerDay: variant.pricePerDay ?? 0,
        id: String(variant.id),
        size: (variant.size as string | null) ?? undefined,
        color: (variant.color as string | null) ?? undefined,
        isPublished: variant.isPublished ?? false,
      })) ?? [];

    setInitialVariants(mappedVariants);
    setVariants(mappedVariants);
    form.setValue("variants", mappedVariants);
  }, []);

  useEffect(() => {
    const preview = watchedImage
      ? URL.createObjectURL(watchedImage)
      : removeImage
        ? placeholderImage
        : product?.urlImage || placeholderImage;
    setImageSrc(preview);
    return () => {
      if (watchedImage) URL.revokeObjectURL(preview);
    };
  }, [watchedImage, product?.urlImage, removeImage]);

  const handleFullReset = () => {
    form.reset(defaultValues);
    setRemoveImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageSrc(product?.urlImage || placeholderImage);
  };

  // Ensure fields are populated when product data arrives on edit page
  useEffect(() => {
    if (product?.id) {
      const newSchema = productFormSchema(product);
      const newDefaults = getFormDefaultValues(newSchema);
      form.reset(newDefaults);
      setRemoveImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setImageSrc(product?.urlImage || placeholderImage);
    }
  }, [product?.id]);

  const { errors } = form.formState;

  const variantItemCustomError = errors.variants?.[0]
    ? JSON.stringify(
        Object.values(errors.variants[0])
          .map((error) =>
            error && typeof error === "object" && "message" in error
              ? error.message
              : error
          )
          .join(", ")
      )
    : undefined;

  const imageError = errors.image?.message;

  if (loadingProduct || loadingCategories || loadingActivities)
    return <p className="text-center my-4">Chargement...</p>;

  if (errorProduct || errorCategories || errorActivities) {
    if (errorProduct) {
      console.error("Error on product:", errorProduct);
    }
    if (errorCategories) {
      console.error("Error on categories:", errorCategories);
    }
    if (errorActivities) {
      console.error("Error on activities:", errorActivities);
    }
    return <p className="text-center text-red-500">Erreur de chargement.</p>;
  }

  const handleSubmit = async (formData: ProductFormSchema) => {
    setIsSubmitting(true);
    try {
      const urlImage = removeImage
        ? null
        : formData.image
          ? await uploadImage(formData.image)
          : product?.urlImage;

      const commonData = {
        name: formData.name,
        description: formData.description,
        urlImage: urlImage,
        isPublished: formData.isPublished,
        sku: formData.sku,
        categories: formData.categories.map((id) => ({ id })),
        activities: formData.activities.map((id) => ({ id })),
      };

      if (product?.id) {
        await updateProduct({
          variables: { updateProductId: product.id, data: commonData },
        });
        toast.success("Produit modifié avec succès !");
      } else {
        let createdProductId: number | undefined;

        if (formData.variants.length > 0) {
          const { data } = await createProductWithVariant({
            variables: {
              productData: commonData,
              variants: formData.variants.map(
                ({ color, size, pricePerDay }) => ({
                  color,
                  size,
                  pricePerDay,
                })
              ),
            },
          });
          createdProductId = data?.createProductWithVariantsAdmin?.id;
        } else {
          const { data } = await createProduct({
            variables: { data: commonData },
          });
          createdProductId = data?.createProductAdmin?.id;
        }

        if (createdProductId) {
          toast.success("Produit créé avec succès !");
          navigate(`/admin/products/edit/${createdProductId}`);
        }
      }
    } catch (error: any) {
      console.error("GraphQL Error:", error);

      if (error.graphQLErrors?.length > 0) {
        const validationError = error.graphQLErrors[0].extensions;
        console.error("Validation details:", validationError);
        toast.error(
          "Erreur de validation : " + validationError?.message || "Erreur."
        );
      } else {
        toast.error("Une erreur est survenue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (childId: number) => {
    const prev = form.getValues("categories");
    const next = prev.includes(childId)
      ? prev.filter((id) => id !== childId)
      : [...prev, childId];
    form.setValue("categories", next);
  };
  const handleActivityToggle = (activityId: number) => {
    const prev = form.getValues("activities");
    const next = prev.includes(activityId)
      ? prev.filter((id) => id !== activityId)
      : [...prev, activityId];
    form.setValue("activities", next);
  };

  const renderVariantForm = (variant?: Variant) =>
    product?.id ? (
      <VariantForm
        productId={Number(product.id)}
        variant={variant}
        refetchProduct={refetch}
      />
    ) : (
      <VariantForm setNewVariants={setVariants} variant={variant} />
    );

  const handleDeleteLocalVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteVariant = async (ids?: (string | number)[]) => {
    try {
      if (!ids || ids.length === 0) return false;
      const id = Number(ids[0]);
      await deleteVariantMutation({ variables: { id } });
      await refetch();
      toast.success("Variant supprimé avec succès !");
      return true;
    } catch (e: any) {
      console.error(e);
      const message = e?.graphQLErrors?.[0]?.message as string | undefined;
      if (message && message.toLowerCase().includes("linked to orders")) {
        toast.error(
          "Ce variant est lié à des commandes. Dépubliez-le au lieu de le supprimer."
        );
      } else {
        toast.error("Échec de la suppression du variant");
      }
      return false;
    }
  };

  const handleToggleVariant = async (variantId: number) => {
    try {
      await toggleVariantPublication({ variables: { id: variantId } });
      await refetch();
      toast.success("Statut du variant mis à jour");
    } catch (e) {
      console.error(e);
      toast.error("Impossible de changer la publication du variant");
    }
  };

  return (
    <div className="mx-auto grid flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          noValidate
        >
          <ProductHeader
            handleReset={handleFullReset}
            isPending={isSubmitting}
            product={product}
          />
          <div className="grid gap-4 md:grid-cols-[1fr_350px] lg:grid-cols-3 lg:gap-8">
            <div className="grid h-full auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card className="h-full">
                <CardHeader className="flex flex-row justify-between relative">
                  <CardTitle> Détails du produit</CardTitle>
                  <div className="text-muted-foreground flex items-center gap-6 text-sm absolute right-6 top-0">
                    <SwitchInput
                      form={form}
                      name="isPublished"
                      label="Publier"
                      className="cursor-pointer"
                      isPending={isSubmitting}
                      onlyLabel
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {variantItemCustomError && (
                    <div className="pb-4 text-sm font-bold text-red-500">
                      Variants erreur: {variantItemCustomError}
                    </div>
                  )}
                  <div className="grid space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Nom */}
                      <StringInput
                        label="Nom du produit"
                        form={form}
                        name="name"
                        isPending={isSubmitting}
                        placeholder="Ex: Ski alpin"
                        required
                      />

                      {/* SKU */}
                      <StringInput
                        label="SKU"
                        form={form}
                        name="sku"
                        isPending={isSubmitting}
                        placeholder="SKU"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 gap-6">
                      <TextAreaInput
                        label="Description"
                        form={form}
                        name="description"
                        isPending={isSubmitting}
                        className="h-[100px]"
                        placeholder="Ex: Skis performants pour la descente"
                      />
                    </div>

                    {/* Catégories */}
                    {/* Gérer les groupes de categorie. Pouvoir ajouter les categories enfants. */}
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">Catégories :</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                        {categories?.map((category) => {
                          if (category.childrens?.length === 0) {
                            return null;
                          }
                          return (
                            <div key={category.id} className="mb-2">
                              <h3 className="font-semibold">
                                {category.name} :
                              </h3>
                              <div className="ml-4 space-y-1">
                                {category.childrens?.map((child) => (
                                  <Label
                                    key={child.id}
                                    className="flex items-center gap-2"
                                  >
                                    <Checkbox
                                      id={`child-${child.id}`}
                                      checked={form
                                        .watch("categories")
                                        .includes(Number(child.id))}
                                      onCheckedChange={() =>
                                        handleCategoryToggle(Number(child.id))
                                      }
                                    />
                                    {child.name}
                                  </Label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />
                    {/* Activities */}
                    <div className="flex flex-col gap-2">
                      <h2 className="text-lg font-bold">Activités :</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                        {activities?.map((activity) => (
                          <Label
                            key={activity.id}
                            htmlFor={`activity-${activity.id}`}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`activity-${activity.id}`}
                              checked={form
                                .watch("activities")
                                .includes(Number(activity.id))}
                              onCheckedChange={() =>
                                handleActivityToggle(Number(activity.id))
                              }
                            />
                            {activity.name}
                          </Label>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Variants */}
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold">Variants :</h2>
                      <CreateButton
                        type="button"
                        modalContent={renderVariantForm()}
                        ariaLabel="createVariantAriaLabel"
                        variant="primary"
                        modalTitle="Créer un variant"
                      />
                    </div>

                    {displayedVariants.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {displayedVariants.map((variant, index) => (
                          <div
                            key={variant.id ?? index}
                            className={cn(
                              "flex items-center justify-between p-4 border border-red-700 rounded-lg shadow-sm bg-destructive/10 relative",
                              variant.isPublished &&
                                "bg-green-500/20 border-green-700"
                            )}
                          >
                            <div className="flex flex-col gap-2">
                              <p>
                                <strong>Taille :</strong> {variant.size}
                              </p>
                              <p>
                                <strong>Couleur :</strong> {variant.color}
                              </p>
                              <p>
                                <strong>Prix :</strong>{" "}
                                {Number(variant.pricePerDay / 100).toFixed(2)}{" "}
                                €/J
                              </p>
                            </div>
                            {product?.id && (
                              <div className="flex items-center gap-2 absolute right-3 top-3">
                                <Switch
                                  checked={variant.isPublished}
                                  onCheckedChange={() =>
                                    handleToggleVariant(Number(variant.id))
                                  }
                                  className={
                                    variant.isPublished
                                      ? "data-[state=checked]:bg-primary"
                                      : "data-[state=unchecked]:bg-destructive"
                                  }
                                  aria-label="toggleVariantPublication"
                                />
                                <span className="text-xs font-medium">
                                  {variant.isPublished ? "Publié" : "Dépublié"}
                                </span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              {product?.id && (variant as Variant).id && (
                                <UpdateButton
                                  type="button"
                                  size="icon"
                                  modalContent={renderVariantForm(
                                    variant as Variant
                                  )}
                                  ariaLabel="updateVariantAriaLabel"
                                  variant="primary"
                                  modalTitle="Modifier un variant"
                                />
                              )}
                              {!product?.id ? (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="size-8 min-h-8 min-w-8"
                                  onClick={() =>
                                    handleDeleteLocalVariant(index)
                                  }
                                >
                                  <Trash2 size={18} />
                                </Button>
                              ) : (
                                <DeleteButton
                                  ariaLabel="deleteVariantAriaLabel"
                                  variant="destructive"
                                  onDeleteFunction={handleDeleteVariant}
                                  elementIds={[Number((variant as Variant).id)]}
                                  modalTitle="Supprimer le variant?"
                                  modalDescription="Cette action est irréversible."
                                  confirmButtonValue="Supprimer"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-fit mt-6"
                      disabled={isSubmitting}
                      onClick={handleFullReset}
                    >
                      Réinitialiser
                    </Button>
                    {/* Bouton Submit */}
                    <Button
                      type="submit"
                      className="w-fit mt-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <LoadIcon size={24} /> : "Enregistrer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid h-full auto-rows-max items-start gap-4 lg:gap-8">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Image du produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden border">
                    {!removeImage && (product?.urlImage || watchedImage) ? (
                      <div className="relative">
                        <img
                          id="reference-image"
                          alt="Product image"
                          className="aspect-video w-full h-auto max-h-64 sm:max-h-80 object-contain"
                          src={imageSrc}
                          onError={() => setImageSrc(placeholderImage)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 size-8 min-h-8 min-w-8"
                          aria-label="remove-image"
                          onClick={() => {
                            form.setValue("image", null);
                            form.setValue("removeImage", true);
                            setRemoveImage(true);
                            setImageSrc(placeholderImage);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <FileUploaderInput
                          multiple={false}
                          setFilesFunction={(files) => {
                            const file = files?.[0] || null;
                            form.setValue("image", file);
                            if (file) {
                              form.setValue("removeImage", false);
                              setRemoveImage(false);
                            }
                          }}
                          formFiles={null}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    {imageError && (
                      <div className="pb-4 text-sm font-bold text-red-500">
                        {imageError}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
