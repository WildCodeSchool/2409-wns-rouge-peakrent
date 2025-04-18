import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { uploadImage } from "@/utils/uploadImages";
import { Category, Product, Variant } from "@/gql/graphql";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GET_CATEGORIES } from "@/GraphQL/categories";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { UPDATE_PRODUCT } from "@/GraphQL/updateProduct";
import { VariantForm } from "./VariantForm";
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_WITH_VARIANT,
} from "@/GraphQL/createProduct";
import { useParams } from "react-router-dom";
import { GET_PRODUCT_BY_ID } from "@/GraphQL/products";
import CreateButton from "../buttons/CreateButton";
import UpdateButton from "../buttons/UpdateButton";
import { toast } from "sonner";

export const ProductForm = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: getProductData,
    loading: getProductLoading,
    error: getProductError,
  } = useQuery(gql(GET_PRODUCT_BY_ID), {
    variables: { param: id },
    skip: !id,
  });

  const product: Product | null = getProductData?.getProductById;

  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newVariants, setNewVariants] = useState<Partial<Variant>[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [updateProduct] = useMutation(gql(UPDATE_PRODUCT));
  const [createProduct] = useMutation(gql(CREATE_PRODUCT));
  const [createProductWithVariant] = useMutation(
    gql(CREATE_PRODUCT_WITH_VARIANT)
  );

  const {
    data: getCategoriesData,
    loading: getCategoriesLoading,
    error: getCategoriesError,
  } = useQuery(gql(GET_CATEGORIES));

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
    }
  }, [product]);

  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
  }, [getCategoriesData?.getCategories.categories]);

  if (getProductLoading || getCategoriesLoading) return <p>Chargement...</p>;

  let urlImage = product?.urlImage;
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (image) {
        urlImage = await uploadImage(image);
      }

      const commonData = {
        name,
        description,
        urlImage,
        isPublished,
        sku,
        categories: selectedCategories.map((id) => ({ id })),
      };

      if (product?.id) {
        await updateProduct({
          variables: {
            updateProductId: product.id,
            data: commonData,
          },
        });
        toast.success("Produit modifié avec succès !");
      } else if (newVariants.length > 0) {
        await createProductWithVariant({
          variables: {
            productData: commonData,
            variants: newVariants.map(({ color, size, pricePerHour }) => ({
              color,
              size,
              pricePerHour,
            })),
          },
        });
        toast.success("Produit créé avec succès !");
      } else {
        await createProduct({
          variables: {
            data: commonData,
          },
        });
        toast.success("Produit créé avec succès !");
      }

      if (!product?.id) {
        setName("");
        setSku("");
        setDescription("");
        setImage(null);
        setIsPublished(true);
        setSelectedCategories([]);
        setNewVariants([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoriesCheckboxAction = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const hasVariants =
    Array.isArray(product?.variants) && product.variants.length > 0;

  return (
    <form onSubmit={handleProductFormSubmit}>
      <Label htmlFor="name" className="flex items-center gap-2">
        Name :
        <Input
          id="name"
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Label>

      <Label htmlFor="SKU" className="flex items-center gap-2">
        SKU :
        <Input
          id="SKU"
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />
      </Label>

      <Label htmlFor="description" className="flex items-center gap-2">
        Description :
        <Input
          id="description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Label>

      <Label htmlFor="image" className="flex items-center gap-2">
        Image :
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </Label>

      <Label htmlFor="isPublished" className="flex items-center gap-2">
        Publier :
        <Checkbox
          checked={isPublished}
          id="isPublished"
          onCheckedChange={(checked) => setIsPublished(!!checked)}
        />
      </Label>

      <div className="gap-4">
        <h2>Catégories :</h2>
        {categories?.map((category) => (
          <Label
            htmlFor={`category-${category.id}`}
            key={category.id}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedCategories?.includes(Number(category.id))}
              id={`category-${category.id}`}
              onCheckedChange={() =>
                handleCategoriesCheckboxAction(Number(category.id))
              }
            />
            {category.name}
          </Label>
        ))}
      </div>
      <div className="gap-4">
        <div className="flex justify-between gap-4">
          <h2>Variants :</h2>
          <CreateButton
            modalContent={
              product?.id ? (
                <VariantForm productId={Number(product.id)} />
              ) : (
                <VariantForm setNewVariants={setNewVariants} />
              )
            }
            ariaLabel={"createVariantAriaLabel"}
            variant="primary"
            modalTitle="Créer un variant"
          />
        </div>
        {hasVariants && (
          <div className="flex gap-4">
            {product?.variants?.map((variant: Variant) => (
              <div key={variant.id}>
                <div className="flex items-center gap-4 border rounded-2xl p-4 shadow hover:shadow-md transition duration-200 cursor-pointer">
                  <div className="flex flex-col gap-2">
                    <p>Taille :{variant.size}</p>
                    <p>Couleur :{variant.color}</p>
                    <p className="px-2 py-1 text-white bg-primary border border-black rounded text-sm w-fit justify-self-end">
                      {(Number(variant.pricePerHour) / 100).toFixed(2)} €/J
                    </p>
                  </div>
                </div>
                <UpdateButton
                  modalContent={
                    <VariantForm
                      productId={Number(product?.id)}
                      // setNewVariants={setNewVariants}
                      variant={variant}
                    />
                  }
                  ariaLabel={"updateVariantAriaLabel"}
                  variant="primary"
                  modalTitle="Modifier un variant"
                />
              </div>
            ))}
            {!product?.id && newVariants.length > 0 && (
              <div className="flex gap-4">
                {newVariants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border rounded-2xl p-4 shadow hover:shadow-md transition duration-200 cursor-pointer"
                  >
                    <div className="flex flex-col gap-2">
                      <p>Taille : {variant.size}</p>
                      <p>Couleur : {variant.color}</p>
                      <p className="px-2 py-1 text-white bg-primary border border-black rounded text-sm w-fit justify-self-end">
                        {(Number(variant.pricePerHour) / 100).toFixed(2)} €/J
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button type="submit" disabled={uploading}>
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
