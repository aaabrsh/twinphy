export const formatNumber = (number: number) => {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "b";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "m";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "k";
  } else {
    return number.toString();
  }
};
