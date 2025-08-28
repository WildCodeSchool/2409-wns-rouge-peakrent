export const LIST_VOUCHERS = `
  query Admin_ListVouchers {
    listVouchers {
      id
      code
      type
      amount
      isActive
      startsAt
      endsAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_VOUCHER = `
  mutation Admin_CreateVoucher($data: VoucherCreateInput!) {
    createVoucher(data: $data) {
      id
      code
      type
      amount
      isActive
      startsAt
      endsAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_VOUCHER = `
  mutation Admin_UpdateVoucher($id: ID!, $data: VoucherUpdateInput!) {
    updateVoucher(id: $id, data: $data) {
      id
      code
      type
      amount
      isActive
      startsAt
      endsAt
      createdAt
      updatedAt
    }
  }
`;

export const APPLY_VOUCHER = `
  mutation ApplyVoucherToMyCart($code: String!) {
    applyVoucherToMyCart(code: $code) {
      id
      voucher { id code type amount isActive startsAt endsAt }
    }
  }
`;

export const REMOVE_VOUCHER = `
  mutation RemoveVoucherFromMyCart {
    removeVoucherFromMyCart {
      id
      voucher { id }
    }
  }
`;

/** export const DELETE_VOUCHER = `
  mutation Admin_DeleteVoucher($id: ID!) {
    deleteVoucher(id: $id) { id }
  }
`;
**/
