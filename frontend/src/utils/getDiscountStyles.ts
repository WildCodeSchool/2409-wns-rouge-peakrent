export const getDiscountStyles = (discount: number) => {
  switch (true) {
    case discount > 30:
      return {
        discountColor: "bg-red-600",
        discountBorder: "border-red-400",
      };
    case discount > 20:
      return {
        discountColor: "bg-orange-600",
        discountBorder: "border-orange-400",
      };
    case discount > 10:
      return {
        discountColor: "bg-yellow-600",
        discountBorder: "border-yellow-500",
      };
    case discount > 0:
      return {
        discountColor: "bg-primary",
        discountBorder: "border-primary",
      };
    default:
      return {
        discountColor: "",
        discountBorder: "",
      };
  }
};
