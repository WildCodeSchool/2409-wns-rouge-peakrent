import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modalProvider";
import { Plus } from "lucide-react";
import { VoucherForm } from "./VoucherForm";
import VouchersTable from "./VouchersTable";

export function AdminVouchersPage() {
  const { openModal } = useModal();
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold leading-none tracking-tight">
          Codes de réduction
        </h1>
        <Button onClick={() => openModal(<VoucherForm />)}>
          <Plus size={16} className="mr-2" />
          Nouveau voucher
        </Button>
      </div>
      <section className="mt-5">
        <VouchersTable />
      </section>
    </div>
  );
}
