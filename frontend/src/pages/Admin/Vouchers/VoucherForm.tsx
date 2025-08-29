import { zodResolver } from "@hookform/resolvers/zod";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
  StringInput,
  SingleSelectorInput,
  DateRangePickerInput,
} from "@/components/forms/formField";
import { getFormDefaultValues } from "@/components/forms/utils/getFormDefaultValues";
import { LoadIcon } from "@/components/icons/LoadIcon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useModal } from "@/context/modalProvider";
import {
  CREATE_VOUCHER,
  LIST_VOUCHERS,
  UPDATE_VOUCHER,
} from "@/graphQL/vouchers";
import { Voucher } from "@/gql/graphql";
import {
  generateVoucherFormSchema,
  VoucherFormSchema,
  toLocalInput,
} from "@/schemas/voucherSchemas";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";

type VoucherFormUI = VoucherFormSchema & {
  dateRange?: { from?: string; to?: string };
};

export function VoucherForm({ datas }: { datas?: Voucher }) {
  const { closeModal } = useModal();

  const [createVoucher, { loading: isCreating }] = useMutation(
    gql(CREATE_VOUCHER),
    {
      refetchQueries: [{ query: gql(LIST_VOUCHERS) }],
      awaitRefetchQueries: true,
    }
  );

  const [updateVoucher, { loading: isUpdating }] = useMutation(
    gql(UPDATE_VOUCHER),
    {
      refetchQueries: [{ query: gql(LIST_VOUCHERS) }],
      awaitRefetchQueries: true,
    }
  );

  const formSchema = generateVoucherFormSchema(datas);

  const isoToDateOnly = (iso?: string | null) =>
    iso ? toLocalInput(iso).slice(0, 10) : "";

  const defaultValues: VoucherFormUI = {
    ...(getFormDefaultValues(formSchema) as VoucherFormSchema),
    dateRange: {
      from: isoToDateOnly(datas?.startsAt ?? undefined),
      to: isoToDateOnly(datas?.endsAt ?? undefined),
    },
  };

  const form = useForm<VoucherFormUI>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const disabled = isCreating || isUpdating;

  const toServerAmount = (type: string, amountStr: string) => {
    const normalized = (amountStr ?? "").replace(",", ".");
    if (type === "fixed") {
      const euros = Number(normalized || "0");
      return Math.round(euros * 100);
    }
    return parseInt(normalized, 10);
  };

  const dateOnlyToLocalISO = (d?: string | null) => {
    if (!d) return null;
    const [y, m, day] = d.split("-").map(Number);
    if (!y || !m || !day) return null;
    return new Date(y, m - 1, day, 0, 0, 0).toISOString();
  };

  useEffect(() => {
    const sub = form.watch((val, { name }) => {
      if (name === "dateRange") {
        const fromISO = dateOnlyToLocalISO(val.dateRange?.from);
        const toISO = dateOnlyToLocalISO(val.dateRange?.to);
        form.setValue("startsAt", fromISO ?? "");
        form.setValue("endsAt", toISO ?? "");
      }
    });

    const init = form.getValues("dateRange");
    form.setValue("startsAt", dateOnlyToLocalISO(init?.from) ?? "");
    form.setValue("endsAt", dateOnlyToLocalISO(init?.to) ?? "");

    return () => sub.unsubscribe?.();
  }, [form]);

  const buildPayload = (fv: VoucherFormUI) => {
    const starts = fv.startsAt || dateOnlyToLocalISO(fv.dateRange?.from);
    const ends = fv.endsAt || dateOnlyToLocalISO(fv.dateRange?.to);

    return {
      code: fv.code,
      type: fv.type,
      amount: toServerAmount(fv.type, fv.amount),
      startsAt: starts,
      endsAt: ends,
      isActive: fv.isActive,
    };
  };

  const handleCreate = async (fv: VoucherFormUI) => {
    const res = await createVoucher({ variables: { data: buildPayload(fv) } });
    if (res.data) {
      toast.success("Voucher créé avec succès");
      closeModal();
    } else {
      toast.error("Erreur lors de la création du voucher");
    }
  };

  const handleUpdate = async (fv: VoucherFormUI) => {
    const res = await updateVoucher({
      variables: { id: Number(datas!.id), data: buildPayload(fv) },
    });
    if (res.data) {
      toast.success("Voucher modifié avec succès");
      closeModal();
    } else {
      toast.error("Erreur lors de la modification du voucher");
    }
  };

  const onSubmit = async (fv: VoucherFormUI) => {
    try {
      datas ? await handleUpdate(fv) : await handleCreate(fv);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message ?? "Erreur");
    }
  };

  const handleReset = () => {
    form.reset({
      ...(getFormDefaultValues(formSchema) as VoucherFormSchema),
      dateRange: {
        from: isoToDateOnly(datas?.startsAt ?? undefined),
        to: isoToDateOnly(datas?.endsAt ?? undefined),
      },
    });
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
          placeholder='ex: 10 (10%) ou 10 (10,00 € si "fixed")'
          isPending={disabled}
          required
        />

        <DateRangePickerInput
          form={form}
          name="dateRange"
          label="Validité"
          isPending={disabled}
          from={form.getValues("dateRange")?.from}
          to={form.getValues("dateRange")?.to}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                  disabled={disabled}
                  id="isActive"
                />
              </FormControl>
              <FormLabel htmlFor="isActive">Actif</FormLabel>
            </FormItem>
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
