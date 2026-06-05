export interface MadcowTestInputs {
  squat: number; // 测试重量(kg)
  bench: number;
  row: number;
  press: number;
  deadlift: number;
}

export interface SetWeight {
  setNumber: number;
  reps: number;
  weight: number;
}

export interface DayPlan {
  dayLabel: string; // "Monday" | "Wednesday" | "Friday"
  exercises: {
    name: string;
    sets: SetWeight[];
  }[];
}

const ROUND_TO = 2.5; // 最小杠铃片

function roundWeight(weight: number): number {
  return Math.round(weight / ROUND_TO) * ROUND_TO;
}

/**
 * 根据测试重量计算起始5RM和1RM
 * Madcow 使用 Epley 公式: 1RM = weight × (1 + reps/30)
 */
function calcStartingWeights(testWeight: number, testReps: number) {
  const oneRM = testWeight * (1 + testReps / 30);
  const fiveRM = oneRM / (1 + 5 / 30);
  // 起始重量 = 5RM 向下取整到2.5kg
  const startWeight = roundWeight(fiveRM * 0.93); // ~93% of 5RM as week1 top set
  return { oneRM, fiveRM, startWeight };
}

/**
 * 生成某一天的阶梯组重量
 * @param topSetWeight - 当天第5组(最重组)的重量
 * @param intervalPct - 组间递增百分比 (默认12.5%)
 * @param repScheme - 每组的次数方案
 */
function generateRampedSets(
  topSetWeight: number,
  intervalPct: number,
  repScheme: number[],
): SetWeight[] {
  const sets: SetWeight[] = [];
  for (let i = 0; i < repScheme.length; i++) {
    // 从最重组反推前面各组重量
    const setsFromTop = repScheme.length - 1 - i;
    const rawWeight = topSetWeight / Math.pow(1 + intervalPct, setsFromTop);
    sets.push({
      setNumber: i + 1,
      reps: repScheme[i],
      weight: roundWeight(rawWeight),
    });
  }
  return sets;
}

/**
 * 生成完整12周计划
 */
export function generateMadcowPlan(inputs: MadcowTestInputs): DayPlan[][] {
  const sq = calcStartingWeights(inputs.squat, 5);
  const bn = calcStartingWeights(inputs.bench, 5);
  const rw = calcStartingWeights(inputs.row, 12);
  const pr = calcStartingWeights(inputs.press, 3);
  const dl = calcStartingWeights(inputs.deadlift, 3);

  const INTERVAL = 0.125; // 12.5%
  const WEEKLY_INCREMENT = 0.025; // 每周顶层组递增约2.5%

  const weeks: DayPlan[][] = [];

  for (let w = 0; w < 12; w++) {
    const weekMultiplier = 1 + w * WEEKLY_INCREMENT;

    // === 周一：深蹲／卧推／划船 5组×5次，逐组加重 ===
    const monSquatTop = roundWeight(sq.startWeight * weekMultiplier);
    const monBenchTop = roundWeight(bn.startWeight * weekMultiplier);
    const monRowTop = roundWeight(rw.startWeight * weekMultiplier);

    const monday: DayPlan = {
      dayLabel: "Monday",
      exercises: [
        {
          name: "Squat",
          sets: generateRampedSets(monSquatTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
        {
          name: "Bench Press",
          sets: generateRampedSets(monBenchTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
        {
          name: "Barbell Row",
          sets: generateRampedSets(monRowTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
      ],
    };

    // === 周三：轻量深蹲／推举／硬拉 5组×5次 ===
    // 轻量深蹲 = 周一顶层组重量，但不做加重（即只用周一重量做恢复）
    const wedSquatTop = monSquatTop;
    const wedPressTop = roundWeight(pr.startWeight * weekMultiplier);
    const wedDLTop = roundWeight(dl.startWeight * weekMultiplier);

    const wednesday: DayPlan = {
      dayLabel: "Wednesday",
      exercises: [
        {
          name: "Light Squat",
          sets: generateRampedSets(wedSquatTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
        {
          name: "Overhead Press",
          sets: generateRampedSets(wedPressTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
        {
          name: "Deadlift",
          sets: generateRampedSets(wedDLTop, INTERVAL, [5, 5, 5, 5, 5]),
        },
      ],
    };

    // === 周五：深蹲／卧推／划船 + 大重量三连组 + 减轻重量的8次回退组 ===
    const friSquatTop = roundWeight(sq.startWeight * weekMultiplier * 1.02); // slightly heavier than Mon
    const friBenchTop = roundWeight(bn.startWeight * weekMultiplier * 1.02);
    const friRowTop = roundWeight(rw.startWeight * weekMultiplier * 1.02);

    const friday: DayPlan = {
      dayLabel: "Friday",
      exercises: [
        {
          name: "Squat",
          sets: [
            ...generateRampedSets(friSquatTop, INTERVAL, [5, 5, 5, 5]).slice(
              0,
              4,
            ),
            { setNumber: 5, reps: 3, weight: roundWeight(friSquatTop * 1.05) },
            { setNumber: 6, reps: 8, weight: roundWeight(friSquatTop * 0.85) },
          ],
        },
        {
          name: "Bench Press",
          sets: [
            ...generateRampedSets(friBenchTop, INTERVAL, [5, 5, 5, 5]).slice(
              0,
              4,
            ),
            { setNumber: 5, reps: 3, weight: roundWeight(friBenchTop * 1.05) },
            { setNumber: 6, reps: 8, weight: roundWeight(friBenchTop * 0.85) },
          ],
        },
        {
          name: "Barbell Row",
          sets: [
            ...generateRampedSets(friRowTop, INTERVAL, [5, 5, 5, 5]).slice(
              0,
              4,
            ),
            { setNumber: 5, reps: 3, weight: roundWeight(friRowTop * 1.05) },
            { setNumber: 6, reps: 8, weight: roundWeight(friRowTop * 0.85) },
          ],
        },
      ],
    };

    weeks.push([monday, wednesday, friday]);
  }

  return weeks;
}
