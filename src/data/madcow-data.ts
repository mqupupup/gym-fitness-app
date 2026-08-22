// 疯牛5x5 (Madcow 5x5) 数据层
// 基于官方Excel：12周计划，每周3天（周一/周三/周五）
// 核心逻辑：前4组递增热身，最后1组正式组；周五加1×3强度组+1×8容量组
// 递增：下周周一正式组 = 本周周五1×3重量；周三推举/硬拉每周正式组+2.5%

export type LiftKey = "squat" | "bench" | "row" | "press" | "deadlift";

export interface MadcowTestInputs {
  squat: number;    // 深蹲测试重量(kg)
  bench: number;    // 卧推测试重量(kg)
  row: number;      // 划船测试重量(kg)
  press: number;    // 推举测试重量(kg)
  deadlift: number; // 硬拉测试重量(kg)
}

export interface MadcowTestReps {
  squat: number;
  bench: number;
  row: number;
  press: number;
  deadlift: number;
}

export const DEFAULT_TEST_REPS: MadcowTestReps = {
  squat: 5,
  bench: 5,
  row: 12,
  press: 3,
  deadlift: 3,
};

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  isTopSet?: boolean;   // 正式组
  isIntensitySet?: boolean; // 周五1×3强度组
  isVolumeSet?: boolean;    // 周五1×8容量组
}

export interface Exercise {
  key: LiftKey;
  name: string;
  sets: ExerciseSet[];
}

export interface DayPlan {
  dayKey: "monday" | "wednesday" | "friday";
  dayLabel: string;
  weekday: string;
  exercises: Exercise[];
}

export interface WeekPlan {
  week: number;
  phase: string;
  days: DayPlan[];
}

const ROUND_TO = 2.5;
const INTERVAL = 0.125; // 组间递增12.5%
const WEEKLY_GAIN = 0.025; // 每周正式组递增2.5%

function roundWeight(w: number): number {
  return Math.round(w / ROUND_TO) * ROUND_TO;
}

// Epley公式计算1RM
function calc1RM(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

// 计算5RM
function calc5RM(weight: number, reps: number): number {
  const oneRM = calc1RM(weight, reps);
  return oneRM / (1 + 5 / 30);
}

// 起始重量 = 5RM × 93%（第1周周一正式组）
export function getStartingWeight(testWeight: number, testReps: number): number {
  const fiveRM = calc5RM(testWeight, testReps);
  return roundWeight(fiveRM * 0.93);
}

export function get5RM(testWeight: number, testReps: number): number {
  return roundWeight(calc5RM(testWeight, testReps));
}

// 生成递增热身组（从正式组反推）
// 5组：约50%→62%→77%→88%→100%
// 4组：约62%→77%→88%→100%
function generateRampedSets(
  topWeight: number,
  numSets: number,
  reps: number,
): ExerciseSet[] {
  const sets: ExerciseSet[] = [];
  for (let i = 0; i < numSets; i++) {
    const setsFromTop = numSets - 1 - i;
    const rawWeight = topWeight / Math.pow(1 + INTERVAL, setsFromTop);
    sets.push({
      setNumber: i + 1,
      reps,
      weight: roundWeight(rawWeight),
      isTopSet: i === numSets - 1,
    });
  }
  return sets;
}

const EXERCISE_NAMES: Record<LiftKey, string> = {
  squat: "深蹲",
  bench: "卧推",
  row: "俯身划船",
  press: "直立杠铃推举",
  deadlift: "硬拉",
};

/**
 * 生成完整12周疯牛5x5计划
 *
 * 递增逻辑：
 * - 周一/周五动作（深蹲/卧推/划船）：维护currentTop，每周五1×3=currentTop×1.025，
 *   下周一currentTop=本周五1×3
 * - 周三动作（推举/硬拉）：每周正式组直接×1.025
 * - 第4周为PR匹配周，正式组不超过5RM
 */
export function generateMadcowProgram(
  inputs: MadcowTestInputs,
  reps: MadcowTestReps = DEFAULT_TEST_REPS,
): WeekPlan[] {
  // 计算各动作起始重量和5RM
  const startWeights: Record<LiftKey, number> = {
    squat: getStartingWeight(inputs.squat, reps.squat),
    bench: getStartingWeight(inputs.bench, reps.bench),
    row: getStartingWeight(inputs.row, reps.row),
    press: getStartingWeight(inputs.press, reps.press),
    deadlift: getStartingWeight(inputs.deadlift, reps.deadlift),
  };

  const fiveRMs: Record<LiftKey, number> = {
    squat: get5RM(inputs.squat, reps.squat),
    bench: get5RM(inputs.bench, reps.bench),
    row: get5RM(inputs.row, reps.row),
    press: get5RM(inputs.press, reps.press),
    deadlift: get5RM(inputs.deadlift, reps.deadlift),
  };

  // 周一/周五动作的当前正式组重量
  let currentSquat = startWeights.squat;
  let currentBench = startWeights.bench;
  let currentRow = startWeights.row;
  // 周三动作的当前正式组重量
  let currentPress = startWeights.press;
  let currentDeadlift = startWeights.deadlift;

  const weeks: WeekPlan[] = [];

  for (let w = 1; w <= 12; w++) {
    const isPRWeek = w === 4; // 第4周匹配5RM PR

    // === 周一：深蹲/卧推/划船，5组×5次 ===
    const mondayTopSquat = isPRWeek
      ? Math.min(currentSquat, fiveRMs.squat)
      : currentSquat;
    const mondayTopBench = isPRWeek
      ? Math.min(currentBench, fiveRMs.bench)
      : currentBench;
    const mondayTopRow = isPRWeek
      ? Math.min(currentRow, fiveRMs.row)
      : currentRow;

    const monday: DayPlan = {
      dayKey: "monday",
      dayLabel: "周一",
      weekday: "正式组日",
      exercises: [
        {
          key: "squat",
          name: EXERCISE_NAMES.squat,
          sets: generateRampedSets(mondayTopSquat, 5, 5),
        },
        {
          key: "bench",
          name: EXERCISE_NAMES.bench,
          sets: generateRampedSets(mondayTopBench, 5, 5),
        },
        {
          key: "row",
          name: EXERCISE_NAMES.row,
          sets: generateRampedSets(mondayTopRow, 5, 5),
        },
      ],
    };

    // === 周三：深蹲4组热身(无正式组) + 推举/硬拉4组(第4组正式) ===
    // 深蹲：4组，第4组=第3组（不加重）
    const squatWarmup4 = generateRampedSets(mondayTopSquat, 4, 5);
    squatWarmup4[3].weight = squatWarmup4[2].weight; // 第4组=第3组
    squatWarmup4[3].isTopSet = false;

    const wednesdayTopPress = isPRWeek
      ? Math.min(currentPress, fiveRMs.press)
      : currentPress;
    const wednesdayTopDeadlift = isPRWeek
      ? Math.min(currentDeadlift, fiveRMs.deadlift)
      : currentDeadlift;

    const wednesday: DayPlan = {
      dayKey: "wednesday",
      dayLabel: "周三",
      weekday: "轻量恢复日",
      exercises: [
        {
          key: "squat",
          name: "深蹲（轻量）",
          sets: squatWarmup4,
        },
        {
          key: "press",
          name: EXERCISE_NAMES.press,
          sets: generateRampedSets(wednesdayTopPress, 4, 5),
        },
        {
          key: "deadlift",
          name: EXERCISE_NAMES.deadlift,
          sets: generateRampedSets(wednesdayTopDeadlift, 4, 5),
        },
      ],
    };

    // === 周五：深蹲/卧推/划船，4组热身 + 1×3强度组 + 1×8容量组 ===
    const friIntensitySquat = roundWeight(mondayTopSquat * (1 + WEEKLY_GAIN));
    const friIntensityBench = roundWeight(mondayTopBench * (1 + WEEKLY_GAIN));
    const friIntensityRow = roundWeight(mondayTopRow * (1 + WEEKLY_GAIN));

    // 1×8用第3组重量（即4组热身中的第3组）
    const friVolumeSquat = generateRampedSets(mondayTopSquat, 4, 5)[2].weight;
    const friVolumeBench = generateRampedSets(mondayTopBench, 4, 5)[2].weight;
    const friVolumeRow = generateRampedSets(mondayTopRow, 4, 5)[2].weight;

    const friday: DayPlan = {
      dayKey: "friday",
      dayLabel: "周五",
      weekday: "强度突破日",
      exercises: [
        {
          key: "squat",
          name: EXERCISE_NAMES.squat,
          sets: [
            ...generateRampedSets(mondayTopSquat, 4, 5),
            {
              setNumber: 5,
              reps: 3,
              weight: friIntensitySquat,
              isIntensitySet: true,
            },
            {
              setNumber: 6,
              reps: 8,
              weight: friVolumeSquat,
              isVolumeSet: true,
            },
          ],
        },
        {
          key: "bench",
          name: EXERCISE_NAMES.bench,
          sets: [
            ...generateRampedSets(mondayTopBench, 4, 5),
            {
              setNumber: 5,
              reps: 3,
              weight: friIntensityBench,
              isIntensitySet: true,
            },
            {
              setNumber: 6,
              reps: 8,
              weight: friVolumeBench,
              isVolumeSet: true,
            },
          ],
        },
        {
          key: "row",
          name: EXERCISE_NAMES.row,
          sets: [
            ...generateRampedSets(mondayTopRow, 4, 5),
            {
              setNumber: 5,
              reps: 3,
              weight: friIntensityRow,
              isIntensitySet: true,
            },
            {
              setNumber: 6,
              reps: 8,
              weight: friVolumeRow,
              isVolumeSet: true,
            },
          ],
        },
      ],
    };

    // 阶段标签
    let phase = "";
    if (w <= 4) phase = "基础适应期";
    else if (w <= 8) phase = "线性进阶期";
    else phase = "强度突破期";

    weeks.push({ week: w, phase, days: [monday, wednesday, friday] });

    // 更新下一周重量
    // 周一/周五动作：下周一正式组 = 本周五1×3
    currentSquat = friIntensitySquat;
    currentBench = friIntensityBench;
    currentRow = friIntensityRow;
    // 周三动作：每周正式组+2.5%
    currentPress = roundWeight(currentPress * (1 + WEEKLY_GAIN));
    currentDeadlift = roundWeight(currentDeadlift * (1 + WEEKLY_GAIN));
  }

  return weeks;
}

// 获取某天的顶层正式组重量（用于周详情页预览）
export function getTopSetWeight(day: DayPlan, exerciseKey: LiftKey): number | null {
  const ex = day.exercises.find((e) => e.key === exerciseKey);
  if (!ex) return null;
  const topSet = ex.sets.find((s) => s.isTopSet);
  return topSet?.weight ?? null;
}
