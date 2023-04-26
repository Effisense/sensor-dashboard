export const formatAreaChart = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};
