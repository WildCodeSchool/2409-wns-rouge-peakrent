import { LoadIcon } from "@/components/icons/LoadIcon";
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
import {
  productFormSchema,
  type ProductFormSchema,
} from "@/schemas/productSchemas";
import { uploadImage } from "@/utils/uploadImages";
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CreateButton from "../buttons/CreateButton";
import UpdateButton from "../buttons/UpdateButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  Separator,
} from "../ui";
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

  const product: Product | null = getProductData?.getProductById;

  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [initialVariants, setInitialVariants] = useState<
    ProductFormSchema["variants"]
  >([]);
  const [variants, setVariants] = useState<ProductFormSchema["variants"]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = productFormSchema(product);
  const defaultValues = getFormDefaultValues(formSchema);
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const displayedVariants = product?.id
    ? product?.variants || []
    : variants || [];

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
      })) ?? [];

    setInitialVariants(mappedVariants);
    setVariants(mappedVariants);
    form.setValue("variants", mappedVariants);
  }, []);

  const { errors } = form.formState;

  const variantItemsErrors = errors.variants?.message;
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
      const urlImage = formData.image
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

      // if (!product?.id) {
      //   setName("");
      //   setSku("");
      //   setDescription("");
      //   setImage(null);
      //   setIsPublished(true);
      //   setSelectedCategories([]);
      //   setSelectedActivities([]);
      //   setNewVariants([]);
      // }
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

  const watchedImage = form.watch("image");

  return (
    <div className="mx-auto grid flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
          noValidate
        >
          <ProductHeader
            handleReset={() => {
              form.reset();
            }}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {displayedVariants.map((variant, index) => (
                          <div
                            key={(variant as Variant).id ?? index}
                            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50"
                          >
                            <div className="flex flex-col">
                              <p>
                                <strong>Taille :</strong> {variant.size}
                              </p>
                              <p>
                                <strong>Couleur :</strong> {variant.color}
                              </p>
                              <p>
                                <strong>Prix :</strong>{" "}
                                {(Number(variant.pricePerDay) / 100).toFixed(2)}{" "}
                                €/J
                              </p>
                            </div>
                            {product?.id && (variant as Variant).id && (
                              <UpdateButton
                                type="button"
                                modalContent={renderVariantForm(
                                  variant as Variant
                                )}
                                ariaLabel="updateVariantAriaLabel"
                                variant="primary"
                                modalTitle="Modifier un variant"
                              />
                            )}
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
                      onClick={() => form.reset(defaultValues)}
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
                    <img
                      id="reference-image"
                      alt="Product image"
                      className="s:scale-125 aspect-video w-full scale-110 object-contain"
                      height="242"
                      src={
                        product?.urlImage
                          ? product.urlImage
                          : "/placeholder.png"
                      }
                      width="152"
                    />
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
