export const lit = (literals: string[], ...substitutions: unknown[]) => {
  let result = '';

  for (let i = 0; i < substitutions.length; i++) {
    result += literals[i];
    result += substitutions[i];
  }

  result += literals[literals.length - 1];
  return result;
};
