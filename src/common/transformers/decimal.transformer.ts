export const decimalTransformer = {
  to: (v: any) => v,
  from: (v: any) => (v === null || v === undefined ? null : parseFloat(parseFloat(v).toFixed(2))),
};
