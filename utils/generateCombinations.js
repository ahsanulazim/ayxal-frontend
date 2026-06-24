export const generateCombinations = (arrays) => {
  return arrays.reduce(
    (acc, current) => {
      const result = [];
      acc.forEach((a) => {
        current.array.forEach((b) => {
          result.push({
            ...a,
            combinations: {
              ...(a.combinations || {}),
              [current.slug]: b.label,
            },
          });
        });
      });
      return result;
    },
    [{}],
  );
};
