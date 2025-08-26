import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { uploadImage } from "@/utils/uploadImages";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CreateButton from "../buttons/CreateButton";
import UpdateButton from "../buttons/UpdateButton";
import { ImageHandler } from "../ui/tables/columns/components/ImageHandler";
import { VariantForm } from "./VariantForm";

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

  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newVariants, setNewVariants] = useState<Partial<Variant>[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const displayedVariants = product?.id
    ? product?.variants || []
    : newVariants || [];

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setDescription(product.description ?? "");
      setIsPublished(product.isPublished);
      setSelectedCategories(
        product.categories?.map((category: Category) => Number(category.id)) ??
          []
      );
      setSelectedActivities(
        product.activities?.map((activity: Activity) => Number(activity.id)) ??
          []
      );
    }
  }, [product]);

  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
    if (getActivitiesData?.getActivities?.activities) {
      setActivities(getActivitiesData.getActivities.activities);
    }
  }, [getCategoriesData, getActivitiesData]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const urlImage = image ? await uploadImage(image) : product?.urlImage;

      const commonData = {
        name,
        description,
        urlImage,
        isPublished,
        sku,
        categories: selectedCategories.map((id) => ({ id })),
        activities: selectedActivities.map((id) => ({ id })),
      };

      if (product?.id) {
        await updateProduct({
          variables: { updateProductId: product.id, data: commonData },
        });
        toast.success("Produit modifié avec succès !");
        navigate(`/products/${product.id}`);
      } else {
        let createdProductId: number | undefined;

        if (newVariants.length > 0) {
          const { data } = await createProductWithVariant({
            variables: {
              productData: commonData,
              variants: newVariants.map(({ color, size, pricePerHour }) => ({
                color,
                size,
                pricePerHour,
              })),
            },
          });
          createdProductId = data?.createProductWithVariants.id;
        } else {
          const { data } = await createProduct({
            variables: { data: commonData },
          });
          createdProductId = data?.createProduct.id;
        }

        if (createdProductId) {
          toast.success("Produit créé avec succès !");
          navigate(`/products/${createdProductId}`);
        }
      }

      if (!product?.id) {
        setName("");
        setSku("");
        setDescription("");
        setImage(null);
        setIsPublished(true);
        setSelectedCategories([]);
        setSelectedActivities([]);
        setNewVariants([]);
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
      setUploading(false);
    }
  };

  const handleCategoryToggle = (childId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };
  const handleActivityToggle = (activityId: number) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const renderVariantForm = (variant?: Variant) =>
    product?.id ? (
      <VariantForm
        productId={Number(product.id)}
        variant={variant}
        refetchProduct={refetch}
      />
    ) : (
      <VariantForm setNewVariants={setNewVariants} variant={variant} />
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 max-w-2xl mx-auto p-8 bg-white shadow rounded-2xl"
    >
      <div className="grid gap-6">
        {/* Nom */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="name" className="font-semibold">
            Nom du produit
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Ski alpin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="SKU" className="font-semibold">
            SKU
          </Label>
          <Input
            id="SKU"
            type="text"
            placeholder="Ex: SKI-12345"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="description" className="font-semibold">
            Description
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="Ex: Skis performants pour la descente"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image */}
        {/* add preview */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="image" className="font-semibold">
            Image
          </Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          {image && (
            <ImageHandler
              src={URL.createObjectURL(image)}
              alt={"preview"}
              className="w-full h-full object-cover border-r"
            />
          )}
        </div>

        {/* Publier */}
        <div className="flex flex-row justify-center items-center gap-2 mt-4">
          <Checkbox
            id="isPublished"
            checked={isPublished}
            onCheckedChange={(checked) => setIsPublished(!!checked)}
          />
          <Label htmlFor="isPublished" className="font-semibold">
            Publier ce produit
          </Label>
        </div>

        {/* Catégories */}
        {/* Gérer les groupes de categorie. Pouvoir ajouter les categories enfants. */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Catégories :</h2>
          <div className="grid grid-cols-2 gap-2">
            {categories?.map((category) => (
              <div key={category.id} className="mb-2">
                <h3 className="font-semibold">{category.name} :</h3>
                <div className="ml-4 space-y-1">
                  {category.childrens?.map((child) => (
                    <Label key={child.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`child-${child.id}`}
                        checked={selectedCategories.includes(Number(child.id))}
                        onCheckedChange={() =>
                          handleCategoryToggle(Number(child.id))
                        }
                      />
                      {child.name}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Activités :</h2>
          <div className="grid grid-cols-2 gap-2">
            {activities?.map((activity) => (
              <Label
                key={activity.id}
                htmlFor={`activity-${activity.id}`}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`activity-${activity.id}`}
                  checked={selectedActivities.includes(Number(activity.id))}
                  onCheckedChange={() =>
                    handleActivityToggle(Number(activity.id))
                  }
                />
                {activity.name}
              </Label>
            ))}
          </div>
        </div>

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
          <div className="grid gap-4">
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
                    {(Number(variant.pricePerHour) / 100).toFixed(2)} €/J
                  </p>
                </div>
                {product?.id && (variant as Variant).id && (
                  <UpdateButton
                    type="button"
                    modalContent={renderVariantForm(variant as Variant)}
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

      {/* Bouton Submit */}
      <Button type="submit" className="w-full mt-6" disabled={uploading}>
        {uploading ? (
          <LoadIcon size={24} />
        ) : product?.id ? (
          "Modifier le produit"
        ) : (
          "Créer le produit"
        )}
      </Button>
    </form>
  );
};
