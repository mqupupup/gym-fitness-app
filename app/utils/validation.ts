// utils/validation.ts

/**
 * 校验用户输入的身体数据是否在合理范围内
 */
export const validateUserData = (
  ageStr: string,
  heightStr: string,
  weightStr: string,
) => {
  const age = parseInt(ageStr);
  const height = parseFloat(heightStr);
  const weight = parseFloat(weightStr);

  // 边界定义
  const BOUNDS = {
    AGE: { min: 1, max: 150, unit: "岁" },
    HEIGHT: { min: 50, max: 300, unit: "cm" },
    WEIGHT: { min: 20, max: 600, unit: "kg" }, // 体重上限设为600kg
  };

  // 校验年龄
  if (isNaN(age) || age < BOUNDS.AGE.min || age > BOUNDS.AGE.max) {
    return {
      isValid: false,
      message: `年龄必须在 ${BOUNDS.AGE.min} 到 ${BOUNDS.AGE.max} 之间`,
    };
  }

  // 校验身高
  if (
    isNaN(height) ||
    height < BOUNDS.HEIGHT.min ||
    height > BOUNDS.HEIGHT.max
  ) {
    return {
      isValid: false,
      message: `身高必须在 ${BOUNDS.HEIGHT.min} 到 ${BOUNDS.HEIGHT.max}cm 之间`,
    };
  }

  // 校验体重
  if (
    isNaN(weight) ||
    weight < BOUNDS.WEIGHT.min ||
    weight > BOUNDS.WEIGHT.max
  ) {
    return {
      isValid: false,
      message: `体重必须在 ${BOUNDS.WEIGHT.min} 到 ${BOUNDS.WEIGHT.max}kg 之间`,
    };
  }

  // 全部通过
  return { isValid: true, message: "" };
};
