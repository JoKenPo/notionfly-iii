export const groupBy = (xs: [], key: string) => {
  return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
  }, {});
};

export const sort = (xs: [], key: string) => {
  return xs.sort((a, b) => {
      if (a[key] > b[key]) return 1;
      if (a[key] < b[key]) return -1;
      return 0;
  })
}

export const sortDesc = (xs: [], key: string) => {
  return xs.sort((a, b) => {
      if (a[key] < b[key]) return 1;
      if (a[key] > b[key]) return -1;
      return 0;
  })
}

export const groupAndSumBy = (xs: [], key: string, sumKey: string) => {
  return Object.values(xs.reduce((accumulator, currentValue) => {
    const name = currentValue[key];
  
    if (!accumulator[name]) {
      accumulator[name] = { ...currentValue };
    } else {
      accumulator[name][sumKey] += currentValue[sumKey];
    }
  
    return accumulator;
  }, {}));
}