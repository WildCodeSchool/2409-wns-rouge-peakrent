import { useState } from "react";

import { useModal } from "@/context/modalProvider";
import { createEnumSchema, createStringSchema } from "@/schemas/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { PlusIcon } from "@radix-ui/react-icons";
import { Folder, Layers, Trash2 } from "lucide-react";

const generateCategoryFormSchema = (datas: any) =>
  z.object({
    category: createStringSchema({
      minLength: 2,
      maxLength: 50,
      defaultValue: datas?.name,
      requiredError: "Le nom est requis",
      invalidFormatError: "Le nom est invalide",
      minLengthError: "Le nom doit contenir au moins 2 caractères",
      maxLengthError: "Le nom doit contenir au plus 50 caractères",
    }),
    variant: createEnumSchema(
      getBadgeVariantOptions().map((option) => option.value),
      "Le badge est requis",
      "Badge invalide",
      datas?.color || "default"
    ),
    subCategories: z
      .array(
        z.object({
          name: createStringSchema({
            minLength: 2,
            maxLength: 50,
            requiredError: "Le nom est requis",
            invalidFormatError: "Le nom est invalide",
            minLengthError: "Le nom doit contenir au moins 2 caractères",
            maxLengthError: "Le nom doit contenir au plus 50 caractères",
          }),
          variant: createEnumSchema(
            getBadgeVariantOptions().map((option) => option.value),
            "Le badge est requis",
            "Badge invalide",
            "default"
          ),
        })
      )
      .default(
        datas?.childrens && datas?.childrens.length > 0 ? datas?.childrens : []
      ),
  });

export type CategoryFormSchema = z.infer<
  ReturnType<typeof generateCategoryFormSchema>
>;

export function CategoryForm({ datas }: { datas?: any }) {
  const [isPending, setIsPending] = useState(false);
  const { closeModal } = useModal();

  const formSchema = generateCategoryFormSchema(datas);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subCategories",
  });

  const onSubmit = async (datas: CategoryFormSchema) => {
    setIsPending(true);
    try {
      // const { success, data, message } = await asyncAction(datas);
      // if (success) {
      //   // Do something with data
      //   // function(data);
      //   toast.success("successMessage");
      //   closeModal();
      // } else {
      //   toast.error("defaultErrorMessage");
      // }
    } catch (error: any) {
      console.error(error);
      toast.error("defaultErrorMessage");
    } finally {
      setIsPending(false);
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
        <div className="flex items-center gap-2 underline underline-offset-4">
          <Folder size={24} className="" />
          <h3 className="text-lg font-bold">Catégorie principale</h3>
        </div>
        <StringInput
          form={form}
          name="category"
          label="Nom de la catégorie"
          placeholder="Nom"
          isPending={isPending}
          required
        />
        <SingleSelectorInput
          form={form}
          name="variant"
          label="Badge variant"
          placeholder="Séléctionner un badge"
          options={getBadgeVariantOptions()}
          isPending={isPending}
          columns={3}
          required
        />

        <Separator className="my-6" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 ">
              <Layers size={24} />
              <h3 className="text-lg font-bold underline underline-offset-4">
                Sous-catégories{" "}
              </h3>
              <span className="text-sm rounded-full bg-olive-300 text-olive-900 size-7 flex items-center justify-center">
                {fields.length}
              </span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => append({ name: "", variant: "default" })}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4">
              <span className="text-md rounded-full flex items-center justify-center font-bold translate-y-1/2 mt-3">
                {index + 1} -
              </span>
              <div className="flex-1 space-y-4">
                <StringInput
                  form={form}
                  name={`subCategories.${index}.name`}
                  label="Nom de la sous-catégorie"
                  placeholder="Nom"
                  isPending={isPending}
                  required
                />
                <SingleSelectorInput
                  form={form}
                  name={`subCategories.${index}.variant`}
                  label="Badge variant"
                  placeholder="Séléctionner un badge"
                  options={getBadgeVariantOptions()}
                  isPending={isPending}
                  columns={3}
                  required
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
          ))}
        </div>

        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-full"
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <LoadIcon size={24} /> : "Enregistrer"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
