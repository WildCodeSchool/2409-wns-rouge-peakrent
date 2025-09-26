export const getPriceFixed = (
  price: number,
  quantity: number = 1,
  numberOfDay: number = 1
) => {
  const pricePerDay = Number(price) / 100;
  return (pricePerDay * quantity * numberOfDay).toFixed(2);
};
