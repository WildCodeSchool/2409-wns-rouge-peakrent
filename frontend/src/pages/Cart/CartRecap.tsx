import { CommandStatusEnum, useCartStoreUser } from "@/stores/user/cart.store";

export function CartRecap() {
  const setCommandTunnelStatus = useCartStoreUser(
    (state) => state.setCommandTunnelStatus
  );
  setCommandTunnelStatus(CommandStatusEnum.pending);
  return <p>Page Recap</p>;
}
