import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { StringInput, SingleSelectorInput } from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import { CREATE_VOUCHER, UPDATE_VOUCHER } from "@/graphQL/vouchers";
import { Voucher } from "@/gql/graphql";

import {
  generateVoucherFormSchema,
  VoucherFormSchema,
  toLocalInput,
} from "@/schemas/voucherSchemas";

export function VoucherForm({ datas }: { datas?: Voucher }) {
  const { closeModal } = useModal();

  const [createVoucher, { loading: isCreating }] = useMutation(
    gql(CREATE_VOUCHER)
  );
  const [updateVoucher, { loading: isUpdating }] = useMutation(
    gql(UPDATE_VOUCHER)
  );

  // --- schema & defaults (même pattern que UserForm)
  const formSchema = generateVoucherFormSchema(datas);
  const defaultValues = getFormDefaultValues(
    formSchema
  ) as unknown as VoucherFormSchema;

  const form = useForm<VoucherFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // --- helpers
  const disabled = isCreating || isUpdating;

  const handleCreate = async (fv: VoucherFormSchema) => {
    const payload = {
      code: fv.code,
      type: fv.type,
      amount: parseInt(fv.amount, 10),
      startsAt: fv.startsAt ? new Date(fv.startsAt).toISOString() : null,
      endsAt: fv.endsAt ? new Date(fv.endsAt).toISOString() : null,
      isActive: fv.isActive,
    };
    const res = await createVoucher({ variables: { data: payload } });
    if (res.data) {
      toast.success("Voucher créé avec succès");
      closeModal();
    } else {
      toast.error("Erreur lors de la création du voucher");
    }
  };

  const handleUpdate = async (fv: VoucherFormSchema) => {
    const payload = {
      code: fv.code,
      type: fv.type,
      amount: parseInt(fv.amount, 10),
      startsAt: fv.startsAt ? new Date(fv.startsAt).toISOString() : null,
      endsAt: fv.endsAt ? new Date(fv.endsAt).toISOString() : null,
      isActive: fv.isActive,
    };
    const res = await updateVoucher({
      variables: { id: Number(datas!.id), data: payload },
    });
    if (res.data) {
      toast.success("Voucher modifié avec succès");
      closeModal();
    } else {
      toast.error("Erreur lors de la modification du voucher");
    }
  };

  const onSubmit = async (fv: VoucherFormSchema) => {
    try {
      if (datas) {
        await handleUpdate(fv);
      } else {
        await handleCreate(fv);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Erreur");
    }
  };

  const handleReset = () => {
    // re-calcule les defaults depuis le schema (comme UserForm)
    form.reset(getFormDefaultValues(formSchema) as any);
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
          name="code"
          label="Code"
          placeholder="RENT20"
          isPending={disabled}
          required
        />

        <SingleSelectorInput
          form={form}
          name="type"
          label="Type"
          placeholder="Type"
          options={[
            { label: "percentage", value: "percentage" },
            { label: "fixed", value: "fixed" },
          ]}
          isPending={disabled}
          required
        />

        <StringInput
          form={form}
          name="amount"
          label="Montant"
          placeholder="ex: 20 (ou 500 pour 5,00€)"
          isPending={disabled}
          required
        />

        {/* Datetime-local (comme avant) */}
        <Controller
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Début (optionnel)</label>
              <input type="datetime-local" className="input" {...field} />
            </div>
          )}
        />
        <Controller
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Fin (optionnel)</label>
              <input type="datetime-local" className="input" {...field} />
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" {...field} />
              <span>Actif</span>
            </label>
          )}
        />

        <div className="ml-auto w-[300px]">
          <div className="flex w-full justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="w-full"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="submit" disabled={disabled} className="w-full">
              {disabled ? <LoadIcon size={24} /> : "Enregistrer"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
