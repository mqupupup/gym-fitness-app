// GZCLP 直线计划数据
// 基于官方表格：GZCLP+BOTB训练计划.xlsx -> GZCLP直线计划
// 核心理念：T1主项线性进阶，T2辅助固定容量，T3自选辅助

export type LiftKey = "squat" | "bench" | "deadlift" | "press";

export type ExerciseLevel = "T1" | "T2" | "T3";

export type GZCLPSet = {
  level: ExerciseLevel;
  reps: string; // 如 "3x5+", "10x3"
  note?: string;
};

export type GZCLPExercise = {
  name: string;
  liftKey?: LiftKey; // 用于计算重量，T3无
  level: ExerciseLevel;
  sets: GZCLPSet[];
  note?: string;
};

export type GZCLPDay = {
  id: string; // day1-day4
  dayOfWeek: string;
  dateLabel: string;
  exercises: GZCLPExercise[];
};

export type GZCLPWeek = {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  isResetWeek: boolean; // 第8周起可Reset
  days: GZCLPDay[];
};

// 5RM 输入类型
export type FiveRMs = Record<LiftKey, number>;

// 动作名称映射
export const LIFT_NAMES: Record<LiftKey, string> = {
  squat: "深蹲",
  bench: "卧推",
  deadlift: "硬拉",
  press: "直立杠铃推举",
};

// 4天训练模板（固定动作安排）
const DAY_TEMPLATES: Omit<GZCLPDay, "id">[] = [
  {
    dayOfWeek: "周一",
    dateLabel: "Day 1",
    exercises: [
      {
        name: "深蹲",
        liftKey: "squat",
        level: "T1",
        sets: [{ level: "T1", reps: "3×5+", note: "最后一组尽力多做" }],
      },
      {
        name: "卧推",
        liftKey: "bench",
        level: "T2",
        sets: [{ level: "T2", reps: "10×3" }],
      },
      {
        name: "俯身划船",
        level: "T3",
        sets: [{ level: "T3", reps: "自选" }],
        note: "背部辅助，选择能完成规定次数的重量",
      },
    ],
  },
  {
    dayOfWeek: "周二",
    dateLabel: "Day 2",
    exercises: [
      {
        name: "直立杠铃推举",
        liftKey: "press",
        level: "T1",
        sets: [{ level: "T1", reps: "3×5+", note: "最后一组尽力多做" }],
      },
      {
        name: "硬拉",
        liftKey: "deadlift",
        level: "T2",
        sets: [{ level: "T2", reps: "10×3" }],
      },
      {
        name: "引体向上",
        level: "T3",
        sets: [{ level: "T3", reps: "自选" }],
        note: "背部辅助，无法完成可改用高位下拉",
      },
    ],
  },
  {
    dayOfWeek: "周四",
    dateLabel: "Day 3",
    exercises: [
      {
        name: "卧推",
        liftKey: "bench",
        level: "T1",
        sets: [{ level: "T1", reps: "3×5+", note: "最后一组尽力多做" }],
      },
      {
        name: "深蹲",
        liftKey: "squat",
        level: "T2",
        sets: [{ level: "T2", reps: "10×3" }],
      },
      {
        name: "俯身划船",
        level: "T3",
        sets: [{ level: "T3", reps: "自选" }],
        note: "背部辅助，选择能完成规定次数的重量",
      },
    ],
  },
  {
    dayOfWeek: "周六",
    dateLabel: "Day 4",
    exercises: [
      {
        name: "硬拉",
        liftKey: "deadlift",
        level: "T1",
        sets: [{ level: "T1", reps: "3×5+", note: "最后一组尽力多做" }],
      },
      {
        name: "直立杠铃推举",
        liftKey: "press",
        level: "T2",
        sets: [{ level: "T2", reps: "10×3" }],
      },
      {
        name: "引体向上",
        level: "T3",
        sets: [{ level: "T3", reps: "自选" }],
        note: "背部辅助，无法完成可改用高位下拉",
      },
    ],
  },
];

// 重量计算工具
// 取整到最近的2.5kg倍数
export const roundTo2_5 = (weight: number): number => {
  return Math.round(weight / 2.5) * 2.5;
};

// T1起始重量 = 5RM × 0.85
export const getT1StartingWeight = (fiveRM: number): number => {
  return roundTo2_5(fiveRM * 0.85);
};

// T1第n周重量 = 起始 + (n-1)×2.5，最大不超过5RM×0.95
export const getT1Weight = (fiveRM: number, week: number): number => {
  const starting = getT1StartingWeight(fiveRM);
  const maxWeight = roundTo2_5(fiveRM * 0.95);
  const calculated = starting + (week - 1) * 2.5;
  return Math.min(calculated, maxWeight);
};

// T2重量 = 5RM × 0.65（固定，不随周变化）
export const getT2Weight = (fiveRM: number): number => {
  return roundTo2_5(fiveRM * 0.65);
};

// 生成12周计划
export const generateGZCLPProgram = (): GZCLPWeek[] => {
  const weeks: GZCLPWeek[] = [];

  for (let i = 1; i <= 12; i++) {
    const days: GZCLPDay[] = DAY_TEMPLATES.map((template, idx) => ({
      id: `day${idx + 1}`,
      ...template,
    }));

    let title: string;
    let description: string;

    if (i <= 4) {
      title = `第${i}周：基础适应`;
      description = "线性进阶起始，T1每周递增2.5kg，建立动作模式";
    } else if (i <= 7) {
      title = `第${i}周：强度提升`;
      description = "T1重量持续递增，接近5RM的90%，注意恢复";
    } else {
      title = `第${i}周：平台/Reset`;
      description = "T1达到平台期，可选择Reset降低重量重新开始，或维持当前重量";
    }

    weeks.push({
      id: String(i),
      weekNumber: i,
      title,
      description,
      isResetWeek: i >= 8,
      days,
    });
  }

  return weeks;
};

export const GZCLP_PROGRAM = generateGZCLPProgram();

// Reset说明
export const RESET_INFO = {
  title: "Reset 机制",
  description: "当T1重量无法完成3×5+时，启动Reset：",
  steps: [
    "将该动作的T1重量降低10-15%",
    "重新开始线性进阶，每周递增2.5kg",
    "其他动作不受影响，继续正常进阶",
    "如果需要两次Reset，说明该计划已不适合你，建议更换更高阶计划",
  ],
};
