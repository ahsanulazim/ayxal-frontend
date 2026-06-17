export const generateCombinations = (arrays) => {
  return arrays.reduce(
    (acc, current) => {
      const result = [];
      acc.forEach((a) => {
        current.array.forEach((b) => {
          result.push({
            ...a,
            // combinations অবজেক্ট তৈরি করছি যা মঙ্গোডিবির জন্য সুবিধা দেবে
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
