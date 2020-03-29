export const calcAvg = (data: number[]) => {
  if (data.length === 0) {
    return 0;
  }

  let sum = 0;
  data.forEach(item => (sum += item));

  return sum / data.length;
};
