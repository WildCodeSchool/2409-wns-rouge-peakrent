export const getRenderLabelByValue = (
  value: string,
  options: Array<{ value: string; renderLabel: () => JSX.Element }>
) => {
  const option = options.find((option) => option.value === value);

  if (option && option.renderLabel) {
    return option.renderLabel();
  }

  return null;
};
