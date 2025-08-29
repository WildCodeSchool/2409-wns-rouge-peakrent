import { Voucher } from "@/gql/graphql";
import { create } from "zustand";

export interface VoucherStoreState {
  vouchers: Voucher[];
  fetched: boolean;

  setVouchers: (v: Voucher[]) => void;
  setFetched: (b: boolean) => void;

  addVoucher: (v: Voucher) => void;
  updateVoucher: (id: number, patch: Partial<Voucher>) => void;
  removeVoucherLocal: (id: number) => void;
}

export const useVoucherStore = create<VoucherStoreState>((set, get) => ({
  vouchers: [],
  fetched: false,

  setVouchers: (v) => set({ vouchers: v }),
  setFetched: (b) => set({ fetched: b }),

  addVoucher: (v) => set((s) => ({ vouchers: [v, ...s.vouchers] })),
  updateVoucher: (id, patch) =>
    set((s) => ({
      vouchers: s.vouchers.map((x) =>
        Number(x.id) === id ? { ...x, ...patch } : x
      ),
    })),
  removeVoucherLocal: (id) =>
    set((s) => ({ vouchers: s.vouchers.filter((x) => Number(x.id) !== id) })),
}));
