import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/context/modalProvider";
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/GraphQL/categories";
import { categoryWithChildrenSchema } from "@/schemas/categorySchemas";
import {
  addCategory,
  updateCategory as updateCategoryStore,
} from "@/stores/admin/category.store";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { Folder, Layers, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type CategoryFormSchema = z.infer<
  ReturnType<typeof categoryWithChildrenSchema>
>;

export function CategoryForm({ datas }: { datas?: any }) {
  const { closeModal } = useModal();
  const [createCategoryAdmin, { loading: createLoading }] = useMutation(
    gql(CREATE_CATEGORY)
  );
  const [updateCategoryAdmin, { loading: updateLoading }] = useMutation(
    gql(UPDATE_CATEGORY)
  );

  const formSchema = categoryWithChildrenSchema(datas);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  const { errors } = form.formState;

  const subCategoriesErrors = errors?.subCategories;

  const onSubmit = async (formData: CategoryFormSchema) => {
    try {
      const data = {
        name: formData.name,
        variant: formData.variant,
        childrens: formData.subCategories,
      };

      let savedCategory;

      if (datas) {
        const { data: updatedCategoryAdmin } = await updateCategoryAdmin({
          variables: { id: datas.id, data },
        });
        savedCategory = updatedCategoryAdmin;
      } else {
        const { data: createdCategoryAdmin } = await createCategoryAdmin({
          variables: { data },
        });
        savedCategory = createdCategoryAdmin;
      }

      if (savedCategory) {
        if (datas) {
          updateCategoryStore(
            Number(datas.id),
            savedCategory.updateCategoryAdmin
          );
          toast.success("Catégorie modifiée avec succès");
        } else {
          addCategory(savedCategory.createCategoryAdmin);
          toast.success("Catégorie créée avec succès");
        }
        closeModal();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Erreur lors de la ${datas ? "modification" : "création"} de la catégorie`
      );
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="flex items-center gap-2 ">
          <Folder size={24} className="" />
          <h3 className="text-base sm:text-lg font-bold underline underline-offset-4">
            Catégorie principale
          </h3>
        </div>
        <StringInput
          form={form}
          name="name"
          label="Nom de la catégorie"
          placeholder="Nom"
          isPending={createLoading || updateLoading}
          required
        />
        <SingleSelectorInput
          form={form}
          name="variant"
          label="Badge variant"
          placeholder="Sélectionner un badge"
          options={getBadgeVariantOptions()}
          isPending={createLoading || updateLoading}
          columns={3}
          required
        />

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex justify-between sm:space-y-0 space-y-2">
            <div className="flex items-center gap-2 ">
              <Layers size={24} />
              <h3 className="text-base sm:text-lg font-bold underline underline-offset-4">
                Sous-catégories{" "}
              </h3>
              <span className="text-sm rounded-full bg-olive-300 text-olive-900 size-7 flex items-center justify-center">
                {fields.length}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => replace([])}
                >
                  <Trash2 className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:block">Vider</span>
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => append({ name: "", variant: "default" })}
              >
                <PlusIcon className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:block">Ajouter</span>
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <span className="text-sm rounded-full items-center justify-center font-bold translate-y-1/2 size-8 mt-2 hidden sm:flex">
                      {index + 1} -
                    </span>
                    <div className="flex-1 space-y-4">
                      <StringInput
                        form={form}
                        name={`subCategories.${index}.name`}
                        label="Nom"
                        placeholder="Nom"
                        isPending={createLoading || updateLoading}
                        required
                      />
                      <SingleSelectorInput
                        form={form}
                        name={`subCategories.${index}.variant`}
                        label="Badge variant"
                        placeholder="Sélectionner un badge"
                        options={getBadgeVariantOptions()}
                        isPending={createLoading || updateLoading}
                        columns={3}
                        required
                      />
                      <StringInput
                        form={form}
                        name={`subCategories.${index}.id`}
                        containerClassName="hidden"
                        isPending={createLoading || updateLoading}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="translate-y-1/2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {Array.isArray(subCategoriesErrors) &&
          subCategoriesErrors.length > 0 && (
            <div className="text-destructive font-medium">
              {subCategoriesErrors.length > 1
                ? `${subCategoriesErrors.length} sous-catégories sont invalides`
                : "Une sous-catégorie est invalide"}
            </div>
          )}

        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={createLoading || updateLoading}
              className="w-full"
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              disabled={createLoading || updateLoading}
              className="w-full"
            >
              {createLoading || updateLoading ? (
                <LoadIcon size={24} />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
