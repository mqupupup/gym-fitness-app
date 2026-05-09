// app/powerlifting-plans/candito-6-week/candito-data.ts

export type ExerciseSet = {
  percentage: string;
  reps: string;
  count?: number;
};

export type Exercise = {
  name: string;
  sets: ExerciseSet[];
};

export type TrainingDay = {
  id: string;
  dateLabel: string;
  exercises: Exercise[];
};

export type TrainingWeek = {
  id: string;
  title: string;
  focus: string;
  description: string;
  days: TrainingDay[];
};

export const CANDITO_PROGRAM: Record<string, TrainingWeek> = {
  "1": {
    id: "1",
    title: "第1周：肌肉适应周",
    focus: "80% x 6 x 4-6",
    description: "肌肉周 - 适应训练强度",
    days: [
      {
        id: "monday",
        dateLabel: "第一天练习",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "80%", reps: "6", count: 4 },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "80%", reps: "6", count: 2 },
            ],
          },
          {
            name: "其他腿部锻炼",
            sets: [{ percentage: "热身", reps: "按需" }],
          },
        ],
      },
      {
        id: "tuesday",
        dateLabel: "第二天练习",

        exercises: [
          {
            name: "卧推",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "50%", reps: "10" },
              { percentage: "70%", reps: "10" },
              { percentage: "75%", reps: "8" },
              { percentage: "80%", reps: "6" },
            ],
          },
          {
            name: "哑铃划船",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "8" },
              { percentage: "", reps: "6" },
            ],
          },
          {
            name: "站姿哑铃推举",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "", reps: "12" },
              { percentage: "", reps: "12" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "8" },
            ],
          },
          {
            name: "负重引体向上",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "", reps: "12" },
              { percentage: "", reps: "12" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "8" },
            ],
          },
        ],
      },
      {
        id: "thursday",
        dateLabel: "隔天第三练",
        exercises: [
          {
            name: "卧推",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "50%", reps: "10" },
              { percentage: "70%", reps: "10" },
              { percentage: "75%", reps: "8" },
              { percentage: "80%", reps: "6" },
            ],
          },
          {
            name: "哑铃划船",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "10" },
              { percentage: "", reps: "8" },
              { percentage: "", reps: "6" },
            ],
          },
        ],
      },
      {
        id: "friday",
        dateLabel: "连续第四练",
        exercises: [
          {
            name: "深蹲",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "70%", reps: "8", count: 4 },
            ],
          },
          {
            name: "硬拉",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "70%", reps: "8", count: 2 },
            ],
          },
        ],
      },
      {
        id: "saturday",
        dateLabel: "周期最后一练",
        exercises: [
          {
            name: "卧推",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "80%", reps: "MR" },
            ],
          },
        ],
      },
    ],
  },

  "2": {
    id: "2",
    title: "第2周：肌肉适应增肌期",
    focus: "80% x MR10 + 5X3",
    description: "增肌阶段 - 增肌训练",
    days: [
      {
        id: "monday",
        dateLabel: "本期开始",

        exercises: [
          {
            name: "深蹲",
            sets: [
              { percentage: "热身", reps: "按需" },
              { percentage: "80%", reps: "MR10" },
            ],
          },
          {
            name: "更多深蹲",
            sets: [{ percentage: "+5磅/2.5公斤", reps: "3", count: 5 }],
          },
        ],
      },
    ],
  },

  "3": {
    id: "3",
    title: "第3周：直线提高OT期",
    focus: "90% x 4-6",
    description: "直线进步 - 力量提升",
    days: [],
  },

  "4": {
    id: "4",
    title: "第4周：大重量习惯期",
    focus: "85-95% x 1-3",
    description: "大重量适应 - 适应大重量",
    days: [],
  },

  "5": {
    id: "5",
    title: "第5周：超重冲刺周",
    focus: "100% x 1-4",
    description: "极限重量周 - 极限重量",
    days: [],
  },

  "6": {
    id: "6",
    title: "第6周：选择周",
    focus: "减载或测试",
    description: "选择：开始新周期、减载或测试1RM",
    days: [
      {
        id: "options",
        dateLabel: "第六周选择",
        exercises: [
          {
            name: "选择1",
            sets: [{ percentage: "", reps: "直接开始下一轮6周计划" }],
          },
          {
            name: "选择2",
            sets: [{ percentage: "", reps: "用轻重量减载一周" }],
          },
          {
            name: "选择3",
            sets: [{ percentage: "", reps: "实际测量1RM" }],
          },
        ],
      },
    ],
  },
};
