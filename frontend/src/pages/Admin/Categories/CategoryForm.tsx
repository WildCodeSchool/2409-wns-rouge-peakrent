import { useState } from "react";

import { useModal } from "@/context/modalProvider";
import { createEnumSchema, createStringSchema } from "@/schemas/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";

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
      getBadgeVariantOptions(),
      "Le badge est requis",
      "Badge invalide",
      datas?.color || "default"
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
        <StringInput
          form={form}
          name="category"
          label="Catégorie"
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
        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="w-full"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <LoadIcon size={24} /> : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
