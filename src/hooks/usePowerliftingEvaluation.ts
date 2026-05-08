import { useEffect, useState } from "react";
import {
  ApiAssessmentRequest,
  ApiResponse,
  AssessmentResult,
  CoefficientType,
  Gender,
} from "../types/powerlifting";
import { parseNumericInput, validateInputs } from "../utils/validation";

interface UsePowerliftingEvaluationProps {
  gender: Gender;
  weight: string;
  squat: string;
  bench: string;
  deadlift: string;
  coefficientType: CoefficientType;
}

export const usePowerliftingEvaluation = ({
  gender,
  weight,
  squat,
  bench,
  deadlift,
  coefficientType,
}: UsePowerliftingEvaluationProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 当输入变化时重置结果
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [gender, weight, squat, bench, deadlift, coefficientType]);

  const evaluate = async () => {
    const validation = validateInputs(weight, squat, bench, deadlift);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const requestData: ApiAssessmentRequest = {
        gender,
        bodyWeight: parseNumericInput(weight),
        squat: parseNumericInput(squat),
        bench: parseNumericInput(bench),
        deadlift: parseNumericInput(deadlift),
        coefficientType,
      };

      const response = await fetch(
        "http://192.168.1.78:3000/api/powerlifting/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();

      if (apiResponse.success && apiResponse.data) {
        setResult(apiResponse.data);
      } else {
        setError(apiResponse.error || "服务器返回错误，请稍后重试");
      }
    } catch (err: any) {
      console.error("API call failed:", err);

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("网络连接失败，请检查网络设置");
      } else if (err.message.includes("HTTP error")) {
        setError("服务器暂时不可用，请稍后重试");
      } else {
        setError("计算过程中发生错误，请检查输入数据");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    error,
    evaluate,
    reset: () => {
      setResult(null);
      setError(null);
    },
  };
};
