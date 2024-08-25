export function formatNumber(val, digitNumber = 2) {
  const numericValue = Number(val);
  if (isNaN(numericValue)) return val;

  const roundedVal = Number(numericValue.toFixed(digitNumber));
  const formattedVal = roundedVal.toLocaleString(undefined, {
    minimumFractionDigits: digitNumber,
    maximumFractionDigits: digitNumber,
  });

  return formattedVal;
}
