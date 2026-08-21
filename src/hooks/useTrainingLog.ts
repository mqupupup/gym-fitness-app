import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export type PlanType = "wendler" | "texas" | "candito" | "gzclp" | "madcow" | "general";

export interface TrainingLog {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  notes: string;
  plan: PlanType;
  createdAt: string;
}

let db: SQLite.SQLiteDatabase | null = null;

const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("training_logs.db");

    // 创建表（新版本带 plan 字段）
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        exercise TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        notes TEXT,
        plan TEXT DEFAULT 'general',
        createdAt TEXT NOT NULL
      );
    `);

    // 迁移：检查是否有 plan 列（旧版本表没有）
    try {
      const columns = await db.getAllAsync<{ name: string }>(
        "PRAGMA table_info(logs)",
      );
      const hasPlanColumn = columns.some((col) => col.name === "plan");

      if (!hasPlanColumn) {
        // 添加 plan 列
        await db.execAsync("ALTER TABLE logs ADD COLUMN plan TEXT DEFAULT 'general'");

        // 根据 notes 内容自动推断旧数据的计划类型
        const allLogs = await db.getAllAsync<TrainingLog>("SELECT id, notes FROM logs");
        for (const log of allLogs) {
          let inferredPlan: PlanType = "general";
          const notesLower = (log.notes || "").toLowerCase();
          if (notesLower.includes("texas")) {
            inferredPlan = "texas";
          } else if (notesLower.includes("wendler")) {
            inferredPlan = "wendler";
          } else if (notesLower.includes("candito")) {
            inferredPlan = "candito";
          } else if (notesLower.includes("gzclp")) {
            inferredPlan = "gzclp";
          } else if (notesLower.includes("madcow")) {
            inferredPlan = "madcow";
          }
          await db.runAsync("UPDATE logs SET plan = ? WHERE id = ?", [inferredPlan, log.id]);
        }
      }
    } catch (e) {
      console.error("迁移 plan 字段失败:", e);
    }
  }
  return db;
};

export const useTrainingLog = () => {
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const database = await initDatabase();
      const result = await database.getAllAsync<TrainingLog>(
        "SELECT * FROM logs ORDER BY createdAt DESC",
      );

      setLogs(result);
    } catch (error) {
      console.error("加载训练日志失败:", error);
      setError("加载训练日志失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const saveLog = useCallback(
    async (logData: Omit<TrainingLog, "id" | "createdAt">) => {
      try {
        const database = await initDatabase();

        const newLog: TrainingLog = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          plan: logData.plan || "general",
          ...logData,
        };

        await database.runAsync(
          "INSERT INTO logs (id, date, exercise, weight, reps, notes, plan, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newLog.id,
            newLog.date,
            newLog.exercise,
            newLog.weight,
            newLog.reps,
            newLog.notes,
            newLog.plan,
            newLog.createdAt,
          ],
        );

        await loadLogs();
        return true;
      } catch (error) {
        console.error("保存训练日志失败:", error);
        setError("保存训练日志失败");
        return false;
      }
    },
    [loadLogs],
  );

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        const database = await initDatabase();
        await database.runAsync("DELETE FROM logs WHERE id = ?", [id]);
        await loadLogs();
        return true;
      } catch (error) {
        console.error("删除训练日志失败:", error);
        setError("删除训练日志失败");
        return false;
      }
    },
    [loadLogs],
  );

  const getRecentLogs = useCallback(
    (limit: number = 10, plan?: PlanType) => {
      let filtered = logs;
      if (plan) {
        filtered = logs.filter((log) => log.plan === plan);
      }
      return filtered.slice(0, limit);
    },
    [logs],
  );

  const getLogsByPlan = useCallback(
    (plan: PlanType) => {
      return logs.filter((log) => log.plan === plan);
    },
    [logs],
  );

  const getLogsByExercise = useCallback(
    (exerciseName: string, plan?: PlanType) => {
      let filtered = logs.filter((log) => log.exercise === exerciseName);
      if (plan) {
        filtered = filtered.filter((log) => log.plan === plan);
      }
      return filtered;
    },
    [logs],
  );

  return {
    logs,
    loading,
    error,
    saveLog,
    getRecentLogs,
    getLogsByPlan,
    getLogsByExercise,
    deleteLog,
    refresh: loadLogs,
  };
};
