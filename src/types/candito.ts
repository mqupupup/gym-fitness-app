interface CanditoSet {
  percentage?: string; // 重量百分比
  reps: string; // 次数
  count: number; // 组数
  type?: "regular" | "mr" | "mr10"; // 训练类型
}

interface CanditoExercise {
  name: string;
  sets: CanditoSet[];
  description?: string;
}

interface CanditoDay {
  id: string;
  dateLabel: string;
  exercises: CanditoExercise[];
}

interface CanditoWeek {
  id: number;
  title: string;
  description: string;
  days: CanditoDay[];
  focus: string;
}
