import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export interface TrainingLog {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  notes: string;
  createdAt: string;
}

let db: SQLite.SQLiteDatabase | null = null;

const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("training_logs.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        exercise TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
    `);
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
  }, [loadLogs]); // loadLogs现在是useCallback包裹的，依赖稳定

  const saveLog = useCallback(
    async (logData: Omit<TrainingLog, "id" | "createdAt">) => {
      try {
        const database = await initDatabase();

        const newLog: TrainingLog = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...logData,
        };

        await database.runAsync(
          "INSERT INTO logs (id, date, exercise, weight, reps, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            newLog.id,
            newLog.date,
            newLog.exercise,
            newLog.weight,
            newLog.reps,
            newLog.notes,
            newLog.createdAt,
          ],
        );

        // 重新加载所有日志
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

        // 重新加载所有日志
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
    (limit: number = 10) => {
      return logs.slice(0, limit);
    },
    [logs],
  );

  const getLogsByPlan = useCallback(
    (planName: string) => {
      return logs.filter((log) => log.notes?.includes(planName));
    },
    [logs],
  );

  const getLogsByExercise = useCallback(
    (exerciseName: string) => {
      return logs.filter((log) => log.exercise === exerciseName);
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
