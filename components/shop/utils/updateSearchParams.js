export const createQueryString = (searchParams, updates = {}) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === false
    ) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
};
