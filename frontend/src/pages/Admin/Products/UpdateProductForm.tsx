import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { uploadImage } from "@/utils/uploadImages";
import { CREATE_PRODUCT } from "@/GraphQL/createProduct";
import { Category, Product } from "@/gql/graphql";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GET_CATEGORIES } from "@/GraphQL/categories";
import { Button } from "@/components/ui/button";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { UPDATE_PRODUCT } from "@/GraphQL/updateProduct";

type UpdateProductFormType = {
  product: Product;
};

export const UpdateProductForm = ({ product }: UpdateProductFormType) => {
  const [name, setName] = useState<string>(product.name);
  const [sku, setSku] = useState<string>(product.sku);
  const [description, setDescription] = useState<string | undefined | null>(
    product.description
  );
  const [isPublished, setIsPublished] = useState<boolean>(product.isPublished);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [updateProduct] = useMutation(gql(UPDATE_PRODUCT));
  console.log(product);

  // const {
  //   data: getCategoriesData,
  //   loading: getCategoriesLoading,
  //   error: getCategoriesError,
  // } = useQuery(gql(GET_CATEGORIES));

  // useEffect(() => {
  //   if (getCategoriesData?.getCategories?.categories) {
  //     setCategories(getCategoriesData.getCategories.categories);
  //   }
  // }, [getCategoriesData?.getCategories.categories]);

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let urlImage = product.urlImage;
      console.log(product.id);
      const updateProductId = product.id;
      if (image) {
        urlImage = await uploadImage(image);
      }

      await updateProduct({
        variables: {
          updateProductId,
          data: {
            name,
            description,
            urlImage,
            isPublished,
            sku,
            // categories: selectedCategories.map((id) => ({ id })),
          },
        },
      });

      alert("Product created!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  // const handleCategoriesCheckboxAction = (categoryId: number) => {
  //   if (!setSelectedCategories) return;

  //   setSelectedCategories((prev) =>
  //     prev.includes(categoryId)
  //       ? prev.filter((id) => id !== categoryId)
  //       : [...prev, categoryId]
  //   );
  // };

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

      {/* {categories.map((category) => (
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
      ))} */}

      <Button type="submit" disabled={uploading}>
        {uploading ? <LoadIcon size={24} /> : "Update Product"}
      </Button>
    </form>
  );
};
