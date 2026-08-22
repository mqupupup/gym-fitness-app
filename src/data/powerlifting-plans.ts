// 力量举计划数据库 — 多维度结构化数据
// 为AI推荐系统和计划筛选提供结构化字段支持

export type ExperienceLevel = "初级" | "中级" | "中高级" | "高级";
export type ProgressionType = "linear" | "weekly_periodization" | "block_periodization";
export type PrimaryGoal = "strength" | "powerlifting" | "hypertrophy";
export type FatigueManagement = "low" | "moderate" | "high";

export interface PowerliftingPlan {
  id: string;
  title: string;
  subtitle: string; // 英文原名
  description: string;
  icon: string;
  creator: string;
  creatorNote?: string; // 创建者来源说明（如有混淆）
  experienceLevel: {
    min: ExperienceLevel;
    typical: ExperienceLevel | string;
  };
  progressionType: ProgressionType;
  progressionTypeLabel: string;
  primaryGoal: PrimaryGoal;
  primaryGoalLabel: string;
  frequency: number; // 每周训练天数
  fatigueManagement: FatigueManagement;
  fatigueManagementLabel: string;
  duration: string;
  coreFeatures: string[]; // 核心特点标签
  route: string; // 跳转路径
}

export const POWERLIFTING_PLANS: PowerliftingPlan[] = [
  {
    id: "wendler-531",
    title: "Wendler 5-3-1",
    subtitle: "Wendler 5/3/1",
    description:
      "Jim Wendler 创建的经典周期化力量计划，基于 Training Max（通常为真实1RM的90%）固定百分比推进，4周一个循环含减载周，注重长期可持续的力量积累。后续版本逐渐加入更多自主调节(autoregulation)。",
    icon: "calendar-outline",
    creator: "Jim Wendler",
    experienceLevel: {
      min: "中级",
      typical: "中级-高级",
    },
    progressionType: "weekly_periodization",
    progressionTypeLabel: "周循环",
    primaryGoal: "strength",
    primaryGoalLabel: "力量",
    frequency: 4,
    fatigueManagement: "moderate",
    fatigueManagementLabel: "中等",
    duration: "4周循环",
    coreFeatures: ["TM百分比系统", "4周循环+减载周", "辅助训练可选"],
    route: "/powerlifting-plans/wendler-531",
  },
  {
    id: "texas-method",
    title: "德州计划",
    subtitle: "Texas Method",
    description:
      "经典三日分化训练（周一容量日、周三恢复日、周五强度日），由 Glenn Pendlay 首创、Mark Rippetoe 在《Practical Programming》中系统化收录。将容量—恢复—强度周期压缩在一周内，适合从新手线性进阶毕业后的中级训练者。",
    icon: "barbell-outline",
    creator: "Glenn Pendlay / Mark Rippetoe",
    experienceLevel: {
      min: "中级",
      typical: "中级",
    },
    progressionType: "weekly_periodization",
    progressionTypeLabel: "周内分化",
    primaryGoal: "strength",
    primaryGoalLabel: "力量",
    frequency: 3,
    fatigueManagement: "moderate",
    fatigueManagementLabel: "中等",
    duration: "每周循环",
    coreFeatures: ["容量/恢复/强度三日分化", "周五强度突破", "《Practical Programming》收录"],
    route: "/powerlifting-plans/texas-method",
  },
  {
    id: "candito-6-week",
    title: "Candito 6周计划",
    subtitle: "Candito 6 Week Program",
    description:
      "Jonnie Candito 设计的6周区块周期化力量计划，从肌肉耐受/肌肥大逐步过渡到力量与峰值，最后一周可选择测试1RM或减量进入下一周期。结构清晰易执行，在 YouTube 和力量训练社区广受欢迎，适合希望系统提升三大项的训练者。",
    icon: "trending-up-outline",
    creator: "Jonnie Candito",
    experienceLevel: {
      min: "中级",
      typical: "中级-中高级",
    },
    progressionType: "block_periodization",
    progressionTypeLabel: "分阶段",
    primaryGoal: "powerlifting",
    primaryGoalLabel: "力量举",
    frequency: 4,
    fatigueManagement: "high",
    fatigueManagementLabel: "较高",
    duration: "6周",
    coreFeatures: ["肌肥大→力量→峰值", "第6周可选测1RM", "三大项专项"],
    route: "/powerlifting-plans/candito-6-week",
  },
  {
    id: "gzclp",
    title: "GZCLP",
    subtitle: "Phrak's GreySkull LP",
    description:
      "Phrak（John Sheaffer）在 GreySkull LP 体系基础上发布的新手线性进阶计划，采用 T1/T2/T3 三级动作分级和 A/B/A 周内轮换。在 Reddit r/Fitness 社区被作为新手计划广泛推荐，程序复杂度高于 Starting Strength 但仍属典型新手线性计划，适合健身新手建立力量基础。",
    icon: "stats-chart-outline",
    creator: "Phrak (John Sheaffer)",
    creatorNote: "基于 GreySkull LP 体系；Cody Lefever 为 GZCL 方法论推广者及 nSuns 创建者，非本模板作者",
    experienceLevel: {
      min: "初级",
      typical: "初级",
    },
    progressionType: "linear",
    progressionTypeLabel: "线性进阶",
    primaryGoal: "strength",
    primaryGoalLabel: "力量",
    frequency: 3,
    fatigueManagement: "low",
    fatigueManagementLabel: "较低",
    duration: "持续进阶",
    coreFeatures: ["T1/T2/T3三级分级", "A/B/A轮换", "新手线性进阶"],
    route: "/powerlifting-plans/gzclp",
  },
  {
    id: "madcow",
    title: "疯牛5x5",
    subtitle: "Madcow 5x5",
    description:
      "基于5x5理念的中级直线力量进阶计划，在 StrongLifts 社区广泛使用。前4组按12.5%递增热身、最后1组为正式组，周五加1×3强度组（+2.5%）和1×8容量组，下周正式组=本周1×3重量，实现跨越式直线进步。适合已具备力量基础、无法从新手线性进阶持续获益的训练者。",
    icon: "fitness-outline",
    creator: "Madcow (StrongLifts社区)",
    experienceLevel: {
      min: "中级",
      typical: "中级",
    },
    progressionType: "linear",
    progressionTypeLabel: "中级线性进阶",
    primaryGoal: "strength",
    primaryGoalLabel: "力量",
    frequency: 3,
    fatigueManagement: "moderate",
    fatigueManagementLabel: "中等",
    duration: "12周",
    coreFeatures: ["递增热身组+正式组", "周五1×3强度突破", "12周直线进阶"],
    route: "/powerlifting-plans/madcow",
  },
];

// 辅助函数：按经验等级筛选
export function getPlansByLevel(level: ExperienceLevel): PowerliftingPlan[] {
  return POWERLIFTING_PLANS.filter(
    (p) => p.experienceLevel.min === level || p.experienceLevel.typical.includes(level),
  );
}

// 辅助函数：按进阶类型筛选
export function getPlansByProgression(type: ProgressionType): PowerliftingPlan[] {
  return POWERLIFTING_PLANS.filter((p) => p.progressionType === type);
}

// 辅助函数：按训练频率筛选
export function getPlansByFrequency(days: number): PowerliftingPlan[] {
  return POWERLIFTING_PLANS.filter((p) => p.frequency === days);
}
