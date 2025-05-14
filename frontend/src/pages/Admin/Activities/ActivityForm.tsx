import { SingleSelectorInput, StringInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { Activity as ActivityType } from "@/gql/graphql";
import { CREATE_ACTIVITY, UPDATE_ACTIVITY } from "@/GraphQL/activities";
import { activitySchema, ActivitySchemaType } from "@/schemas/activity";
import {
  addActivity,
  updateActivity as updateActivityStore,
} from "@/stores/admin/activity.store";
import { getBadgeVariantOptions } from "@/utils/getVariants/getBadgeVariant";
import { gql, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ActivityForm({ datas }: { datas?: ActivityType }) {
  const { closeModal } = useModal();
  const [createActivity, { loading: createLoading }] = useMutation(
    gql(CREATE_ACTIVITY)
  );
  const [updateActivity, { loading: updateLoading }] = useMutation(
    gql(UPDATE_ACTIVITY)
  );

  const formSchema = activitySchema(datas);
  const defaultValues = getFormDefaultValues(formSchema);

  const form = useForm<ActivitySchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (formData: ActivitySchemaType) => {
    try {
      const data = {
        name: formData.name,
        variant: formData.variant,
        urlImage: formData.urlImage,
      };

      let savedActivity;

      if (datas) {
        const { data: updatedActivity } = await updateActivity({
          variables: { id: datas.id, data },
        });
        savedActivity = updatedActivity;
      } else {
        const { data: createdActivity } = await createActivity({
          variables: { data },
        });
        savedActivity = createdActivity;
      }

      if (savedActivity) {
        if (datas) {
          updateActivityStore(Number(datas.id), savedActivity.updateActivity);
          toast.success("Activité modifiée avec succès");
        } else {
          addActivity(savedActivity.createActivity);
          toast.success("Activité créée avec succès");
        }
        closeModal();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        `Erreur lors de la ${datas ? "modification" : "création"} de l'activité`
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
          <Activity size={24} className="" />
          <h3 className="text-base sm:text-lg font-bold underline underline-offset-4">
            Activité
          </h3>
        </div>
        <StringInput
          form={form}
          name="name"
          label="Nom de l'activité"
          placeholder="Nom"
          isPending={createLoading || updateLoading}
          required
        />
        <StringInput
          form={form}
          name="urlImage"
          label="Url de l'image"
          placeholder="Url"
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
