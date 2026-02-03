export function formatCurrency(price) {
  if (typeof price !== "number") price = Number(price) || 0;
  return price.toLocaleString("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
