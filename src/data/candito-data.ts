// Candito 6周力量计划数据
// 基于官方表格：http://www.canditotraininghq.com/app/download/916024204/Candito+6+Week+Program.xlsx

export type OneRMKey = "squat" | "bench" | "deadlift";

export type ExerciseSet = {
  percentage?: number; // 基于1RM的百分比，辅助动作为空
  oneRMKey?: OneRMKey; // 基于哪个1RM计算
  reps: string; // 次数
  count?: number; // 相同组数（如4组×6次写count:4）
  note?: string; // 组级别说明
};

export type Exercise = {
  name: string;
  sets: ExerciseSet[];
  note?: string; // 动作级别说明
};

export type TrainingDay = {
  id: string;
  dateLabel: string;
  dayOfWeek: string;
  exercises: Exercise[];
};

export type TrainingWeek = {
  id: string;
  title: string;
  focus: string;
  description: string;
  days: TrainingDay[];
};

// 辅助动作（无重量，仅次数）
const rowingExercise = (reps: string[]): Exercise => ({
  name: "哑铃划船",
  sets: reps.map(r => ({ reps: r })),
  note: "背部辅助动作，选择能完成规定次数的重量",
});

const pressExercise = (reps: string[]): Exercise => ({
  name: "坐姿哑铃推举",
  sets: reps.map(r => ({ reps: r })),
  note: "肩部辅助动作，选择能完成规定次数的重量",
});

const pullupExercise = (reps: string[]): Exercise => ({
  name: "负重引体向上",
  sets: reps.map(r => ({ reps: r })),
  note: "背部辅助动作，无法负重可改用普通引体向上或高位下拉",
});

const optionalExercise1: Exercise = {
  name: "可选：肱三头肌",
  sets: [{ reps: "8-12", count: 3 }],
  note: "可选动作，推荐：绳索下压 / 窄距卧推 / 仰卧臂屈伸",
};

const optionalExercise2: Exercise = {
  name: "可选：核心训练",
  sets: [{ reps: "8-12", count: 3 }],
  note: "可选动作，推荐：悬垂举腿 / 平板支撑 / 负重卷腹",
};

export const CANDITO_PROGRAM: Record<string, TrainingWeek> = {
  // ========== 第1周：肌肉调理（中等难度）==========
  "1": {
    id: "1",
    title: "第1周：肌肉调理",
    focus: "80% × 6 / 70% × 8",
    description: "中等难度，适应训练强度，建立肌肉耐力基础",
    days: [
      {
        id: "day1",
        dateLabel: "第一天",
        dayOfWeek: "周一",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 80, oneRMKey: "squat", reps: "6", count: 4 },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 80, oneRMKey: "deadlift", reps: "6", count: 2 },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day2",
        dateLabel: "第二天",
        dayOfWeek: "周二",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 50, oneRMKey: "bench", reps: "10" },
              { percentage: 67, oneRMKey: "bench", reps: "10" },
              { percentage: 75, oneRMKey: "bench", reps: "8" },
              { percentage: 77, oneRMKey: "bench", reps: "6" },
            ],
          },
          rowingExercise(["10", "10", "8", "6"]),
          pressExercise(["12", "12", "10", "8"]),
          pullupExercise(["12", "12", "10", "8"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day3",
        dateLabel: "第三天",
        dayOfWeek: "周四",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 50, oneRMKey: "bench", reps: "10" },
              { percentage: 67, oneRMKey: "bench", reps: "10" },
              { percentage: 75, oneRMKey: "bench", reps: "8" },
              { percentage: 77, oneRMKey: "bench", reps: "6" },
            ],
          },
          rowingExercise(["10", "10", "8", "6"]),
          pressExercise(["12", "12", "10", "8"]),
          pullupExercise(["12", "12", "10", "8"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day4",
        dateLabel: "第四天",
        dayOfWeek: "周五",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 70, oneRMKey: "squat", reps: "8", count: 4 },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 70, oneRMKey: "deadlift", reps: "8", count: 2 },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day5",
        dateLabel: "第五天",
        dayOfWeek: "周六",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 80, oneRMKey: "bench", reps: "MR", note: "力竭组，尽可能多次重复" },
            ],
          },
          rowingExercise(["10", "10", "8", "6"]),
          pressExercise(["12", "12", "10", "8"]),
          pullupExercise(["12", "12", "10", "8"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
    ],
  },

  // ========== 第2周：肌肉调理/增肌（高难度）==========
  "2": {
    id: "2",
    title: "第2周：增肌期",
    focus: "MR10 + 5×3 加量/减量",
    description: "高难度增肌阶段，MR10测试决定后续训练量",
    days: [
      {
        id: "day1",
        dateLabel: "第一天",
        dayOfWeek: "周一",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 80, oneRMKey: "squat", reps: "MR10", note: "做到10次仍未力竭则停止；无法完成最低8次则1RM降低2.5%" },
            ],
          },
          {
            name: "深蹲加量组",
            note: "MR10组后加5磅(2.5kg)，组间休息60秒",
            sets: [
              { percentage: 80, oneRMKey: "squat", reps: "3", count: 5, note: "在MR10重量基础上加2.5kg" },
            ],
          },
          {
            name: "硬拉变式",
            note: "直腿硬拉/宽握硬拉/赤字硬拉/停顿式硬拉任选",
            sets: [
              { reps: "热身" },
              { reps: "8", count: 3 },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day2",
        dateLabel: "第二天",
        dayOfWeek: "周二",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 73, oneRMKey: "bench", reps: "10" },
              { percentage: 77, oneRMKey: "bench", reps: "8" },
              { percentage: 81, oneRMKey: "bench", reps: "6-8" },
            ],
          },
          rowingExercise(["10", "8", "8"]),
          pressExercise(["10", "8", "6"]),
          pullupExercise(["10", "8", "6"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day3",
        dateLabel: "第三天",
        dayOfWeek: "周四",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 80, oneRMKey: "squat", reps: "MR10", note: "比周一重量加2.5kg；做到10次仍未力竭则停止" },
            ],
          },
          {
            name: "深蹲减量组",
            note: "MR10组后减10磅(5kg)，根据MR10完成次数决定组数",
            sets: [
              { reps: "3", count: 10, note: "MR10完成10次→10组×3；完成8-9次→8组×3；完成7次→5组×3；少于7次→跳过，后续1RM降低至少2.5%" },
            ],
          },
          {
            name: "硬拉变式",
            note: "直腿硬拉/宽握硬拉/赤字硬拉/停顿式硬拉任选",
            sets: [
              { reps: "热身" },
              { reps: "8", count: 3 },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day4",
        dateLabel: "第四天",
        dayOfWeek: "周五",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 73, oneRMKey: "bench", reps: "10" },
              { percentage: 77, oneRMKey: "bench", reps: "8" },
              { percentage: 81, oneRMKey: "bench", reps: "6-8" },
            ],
          },
          rowingExercise(["10", "8", "8"]),
          pressExercise(["10", "8", "6"]),
          pullupExercise(["10", "8", "6"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day5",
        dateLabel: "第五天",
        dayOfWeek: "周六",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 79, oneRMKey: "bench", reps: "MR", note: "力竭组，尽可能多次重复" },
            ],
          },
          rowingExercise(["10", "8", "8"]),
          pressExercise(["10", "8", "6"]),
          pullupExercise(["10", "8", "6"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
    ],
  },

  // ========== 第3周：线性最大超负荷阶段 ==========
  "3": {
    id: "3",
    title: "第3周：线性超负荷",
    focus: "85-90% × 4-6",
    description: "直线进步阶段，固定重量多组，持续提升力量",
    days: [
      {
        id: "day1",
        dateLabel: "第一天",
        dayOfWeek: "周一",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 85, oneRMKey: "squat", reps: "4-6", count: 3 },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 87.5, oneRMKey: "deadlift", reps: "3-6", count: 2 },
            ],
          },
          { name: "无辅助项", sets: [{ reps: "—" }] },
        ],
      },
      {
        id: "day2",
        dateLabel: "第二天",
        dayOfWeek: "周三",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 85, oneRMKey: "bench", reps: "4-6", count: 3 },
            ],
          },
          rowingExercise(["6", "6", "6"]),
          pressExercise(["6", "6", "6"]),
          pullupExercise(["6", "6", "6"]),
          { name: "无可选项目", sets: [{ reps: "—" }] },
        ],
      },
      {
        id: "day3",
        dateLabel: "第三天",
        dayOfWeek: "周五",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 86, oneRMKey: "squat", reps: "4-6", note: "比周一重量加2.5kg" },
            ],
          },
          {
            name: "硬拉变式",
            note: "直腿硬拉/宽握硬拉/赤字硬拉/停顿式硬拉任选",
            sets: [
              { reps: "热身" },
              { reps: "8" },
            ],
          },
          { name: "无辅助项", sets: [{ reps: "—" }] },
        ],
      },
      {
        id: "day4",
        dateLabel: "第四天",
        dayOfWeek: "周六",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 86, oneRMKey: "bench", reps: "4-6", count: 3, note: "比周三重量加2.5kg" },
            ],
          },
          rowingExercise(["6", "6", "6"]),
          pressExercise(["6", "6", "6"]),
          pullupExercise(["6", "6", "6"]),
          { name: "无可选项目", sets: [{ reps: "—" }] },
        ],
      },
    ],
  },

  // ========== 第4周：适应大重量 ==========
  "4": {
    id: "4",
    title: "第4周：适应大重量",
    focus: "90-95% × 1-3",
    description: "大重量适应阶段，递增组刺激神经，为极限周做准备",
    days: [
      {
        id: "day1",
        dateLabel: "第一天",
        dayOfWeek: "周一",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 90, oneRMKey: "squat", reps: "3" },
              { percentage: 90.5, oneRMKey: "squat", reps: "3" },
              { percentage: 91, oneRMKey: "squat", reps: "3" },
            ],
          },
          {
            name: "硬拉变式",
            note: "直腿硬拉/宽握硬拉/赤字硬拉/停顿式硬拉任选",
            sets: [
              { reps: "热身" },
              { reps: "6", count: 2 },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day2",
        dateLabel: "第二天",
        dayOfWeek: "周二",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 86, oneRMKey: "bench", reps: "3" },
              { percentage: 88, oneRMKey: "bench", reps: "3" },
              { percentage: 90, oneRMKey: "bench", reps: "3" },
            ],
          },
          rowingExercise(["10", "10", "8", "6"]),
          pressExercise(["12", "12", "10", "8"]),
          pullupExercise(["12", "12", "10", "8"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day3",
        dateLabel: "第三天",
        dayOfWeek: "周四",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 91, oneRMKey: "squat", reps: "3" },
              { percentage: 95, oneRMKey: "squat", reps: "1-2" },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 90, oneRMKey: "deadlift", reps: "3" },
              { percentage: 95, oneRMKey: "deadlift", reps: "1-2" },
            ],
          },
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day4",
        dateLabel: "第四天",
        dayOfWeek: "周五",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 88, oneRMKey: "bench", reps: "3" },
              { percentage: 90, oneRMKey: "bench", reps: "2-4" },
              { percentage: 95, oneRMKey: "bench", reps: "1-2" },
            ],
          },
          rowingExercise(["10", "10", "8", "6"]),
          pressExercise(["12", "12", "10", "8"]),
          pullupExercise(["12", "12", "10", "8"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
    ],
  },

  // ========== 第5周：高强度力量训练 ==========
  "5": {
    id: "5",
    title: "第5周：高强度冲刺",
    focus: "97-98% × 1-4",
    description: "极限重量周，三大项冲击个人极限次数，用于预估新1RM",
    days: [
      {
        id: "day1",
        dateLabel: "第一天",
        dayOfWeek: "周一",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { reps: "热身" },
              { percentage: 98, oneRMKey: "squat", reps: "1-4", note: "极限组，记录完成次数用于预估1RM" },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 67.5, oneRMKey: "deadlift", reps: "4" },
              { percentage: 70, oneRMKey: "deadlift", reps: "4" },
              { percentage: 72.5, oneRMKey: "deadlift", reps: "2" },
            ],
          },
          { name: "下肢可选项 1", sets: [{ reps: "热身" }, { reps: "8-12", count: 3 }] },
          { name: "下肢可选项 2", sets: [{ reps: "热身" }, { reps: "8-12", count: 3 }] },
        ],
      },
      {
        id: "day2",
        dateLabel: "第二天",
        dayOfWeek: "周三",
        exercises: [
          {
            name: "卧推",
            sets: [
              { reps: "热身" },
              { percentage: 98, oneRMKey: "bench", reps: "1-4", note: "极限组，记录完成次数用于预估1RM" },
            ],
          },
          rowingExercise(["8", "6", "6"]),
          pressExercise(["8", "6", "6"]),
          pullupExercise(["8", "6", "6"]),
          optionalExercise1,
          optionalExercise2,
        ],
      },
      {
        id: "day3",
        dateLabel: "第三天",
        dayOfWeek: "周五",
        exercises: [
          {
            name: "硬拉",
            sets: [
              { reps: "热身" },
              { percentage: 97.5, oneRMKey: "deadlift", reps: "1-4", note: "极限组，记录完成次数用于预估1RM" },
            ],
          },
          { name: "下肢可选项 1", sets: [{ reps: "热身" }, { reps: "8-12", count: 3 }] },
          { name: "下肢可选项 2", sets: [{ reps: "热身" }, { reps: "8-12", count: 3 }] },
        ],
      },
    ],
  },

  // ========== 第6周：选择周 ==========
  "6": {
    id: "6",
    title: "第6周：选择周",
    focus: "减载 / 测试 / 下一轮",
    description: "三个选项：直接开始下一轮、减载一周、或测试1RM",
    days: [
      {
        id: "options",
        dateLabel: "第六周",
        dayOfWeek: "—",
        exercises: [
          {
            name: "选项1：直接开始下一轮",
            sets: [{ reps: "用预估1RM开始新的6周计划，跳过第6周" }],
          },
          {
            name: "选项2：减载一周",
            sets: [{ reps: "重做第1周训练，但不做最后一个上肢项（周六卧推MR），然后用预估1RM开始下一轮" }],
          },
          {
            name: "选项3：测试1RM",
            sets: [{ reps: "用第6周实际测定1RM，然后减载或直接进入下一轮" }],
          },
        ],
      },
    ],
  },
};
