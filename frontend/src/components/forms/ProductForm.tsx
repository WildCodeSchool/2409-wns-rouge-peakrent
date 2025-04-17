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
import AddItemButton from "../buttons/AddItemButton";
import { VariantForm } from "./VariantForm";
import { CREATE_PRODUCT } from "@/GraphQL/createProduct";

type ProductFormType = {
  product?: Product;
};

export const ProductForm = ({ product }: ProductFormType) => {
  const [name, setName] = useState<string>(product?.name ?? "");
  const [sku, setSku] = useState<string>(product?.sku ?? "");
  const [description, setDescription] = useState<string>(
    product?.description ?? ""
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    product?.isPublished ?? true
  );
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[] | null>();
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    product?.categories?.map((category) => Number(category.id)) || []
  );

  const [updateProduct] = useMutation(gql(UPDATE_PRODUCT));
  const [createProduct] = useMutation(gql(CREATE_PRODUCT));

  const { data: getCategoriesData } = useQuery(gql(GET_CATEGORIES));

  useEffect(() => {
    if (getCategoriesData?.getCategories?.categories) {
      setCategories(getCategoriesData.getCategories.categories);
    }
  }, [getCategoriesData?.getCategories.categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let urlImage = product?.urlImage;

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
        alert("Produit modifié !");
      } else {
        await createProduct({
          variables: {
            data: commonData,
          },
        });
        alert("Produit créé !");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoriesCheckboxAction = (categoryId: number) => {
    if (!setSelectedCategories) return;

    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <Label htmlFor="isPublished" className="flex items-center gap-2">
        <Checkbox
          checked={isPublished}
          id="isPublished"
          onCheckedChange={(checked) => setIsPublished(!!checked)}
        />
        Publier
      </Label>
      <div className="gap-4">
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

      {product?.variants?.length && (
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
            </div>
          ))}
        </div>
      )}

      {product?.id && (
        <AddItemButton
          modalContent={<VariantForm productId={Number(product?.id)} />}
          ariaLabel={"createVariantAriaLabel"}
          variant="primary"
          modalTitle="Créer un variant"
        />
      )}

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
