import { Row } from "@tanstack/react-table";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

import DeleteButton from "@/components/buttons/DeleteButton";
import UpdateButton from "@/components/buttons/UpdateButton";
import { VoucherForm } from "./VoucherForm";

import { UPDATE_VOUCHER /*, DELETE_VOUCHER*/ } from "@/graphQL/vouchers";

interface DataTableRowVouchersActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowVouchersActions<TData>({
  row,
}: DataTableRowVouchersActionsProps<TData>) {
  const voucher = row.original as any;

  const [updateVoucher, { loading }] = useMutation(gql(UPDATE_VOUCHER));
  // const [deleteVoucher] = useMutation(gql(DELETE_VOUCHER));

  const handleDelete = async (id: string | number) => {
    try {
      // Soft delete = désactiver
      await updateVoucher({
        variables: { id: Number(id), data: { isActive: false } },
      });
      toast.success("Voucher désactivé");
      return true;
    } catch (e) {
      console.error(e);
      toast.error("Échec de la suppression.");
      return false;
    }
  };

  return (
    <div className="col-span-2 flex items-center justify-center gap-2 p-2">
      <UpdateButton
        modalContent={<VoucherForm datas={voucher} />}
        ariaLabel={"editVoucherAriaLabel"}
        variant="primary"
        modalTitle="Modifier le voucher"
        modalDescription={voucher.code}
      />
      <DeleteButton
        onDeleteFunction={() => handleDelete(voucher.id)}
        elementIds={[voucher.id]}
        ariaLabel={"deleteVoucherAriaLabel"}
        modalTitle="Désactiver le voucher"
        modalDescription="Voulez-vous vraiment désactiver ce voucher ?"
      />
    </div>
  );
}
