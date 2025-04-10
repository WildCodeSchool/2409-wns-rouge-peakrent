import { colorOptions } from "../colors";

export const getRenderColorByValue = (value: string) => {
  const option = colorOptions.find((option) => option.value === value);

  if (option && option.renderLabel) {
    return option.renderLabel(false);
  }

  return null;
};
