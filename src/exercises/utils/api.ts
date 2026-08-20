// app/(tabs)/exercises/utils/api.ts
import * as FileSystemLegacy from "expo-file-system/legacy";

// ==================== 配置 ====================
export const API_BASE_URL = "http://192.168.1.78:8001"; // ✅ 全部走 FastAPI

const API = {
  INIT_UPLOAD: `${API_BASE_URL}/init-upload`,
  UPLOAD_CHUNK: `${API_BASE_URL}/upload-chunk`,
  GET_CHUNKS: `${API_BASE_URL}/get-uploaded-chunks`,
  MERGE: `${API_BASE_URL}/merge-and-analyze`, // ✅ FastAPI 自带合并+分析
  RESULT: `${API_BASE_URL}/api/result`,
  VIDEO: `${API_BASE_URL}/api/video`,
  EXERCISES: `${API_BASE_URL}/api/exercises`,
};

// uploadFile 保持不变（如果还需要单文件上传的话）
export const uploadFile = async (
  fileUri: string,
  fileName: string,
  onProgress?: (progress: number) => void,
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "video/mp4",
  } as any);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`上传失败: ${response.status}`);
  const result = await response.json();
  if (onProgress) onProgress(100);
  return result;
};

/**
 * 分块上传视频 - 直接调用 FastAPI
 */
export const uploadVideoChunked = async (
  fileUri: string,
  fileName: string,
  onProgress?: (progress: number) => void,
): Promise<any> => {
  // 1. 获取文件信息
  const fileInfo = await FileSystemLegacy.getInfoAsync(fileUri);
  if (!fileInfo.exists) throw new Error("文件不存在");

  const fileSize = fileInfo.size;
  const CHUNK_SIZE = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

  console.log(`[上传] 文件大小: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`[上传] 分块数: ${totalChunks}`);

  // 2. 初始化上传会话
  const initResponse = await fetch(API.INIT_UPLOAD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: fileName,
      fileSize: fileSize,
      totalChunks: totalChunks,
    }),
  });

  if (!initResponse.ok)
    throw new Error(`初始化上传失败: ${initResponse.status}`);
  const initResult = await initResponse.json();

  if (!initResult.success) {
    throw new Error(initResult.error || "初始化上传失败");
  }

  const sessionId: string = initResult.sessionId;
  console.log(`[上传] 会话ID: ${sessionId}`);

  // 3. 查询已上传的分块
  let uploadedChunks: number[] = [];
  try {
    const chunksResponse = await fetch(`${API.GET_CHUNKS}/${sessionId}`);
    if (chunksResponse.ok) {
      const chunksResult = await chunksResponse.json();
      if (chunksResult.success) {
        uploadedChunks = chunksResult.uploadedChunks || [];
      }
    }
  } catch (e) {
    console.log("[上传] 查询已上传分块失败，从头开始");
  }

  // 4. 逐块上传
  for (let ci = 0; ci < totalChunks; ci++) {
    if (uploadedChunks.includes(ci)) {
      console.log(`[上传] 跳过已上传的分块: ${ci}`);
      const progress = Math.round((uploadedChunks.length / totalChunks) * 100);
      if (onProgress) onProgress(progress);
      continue;
    }

    const start = ci * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileSize);

    const chunkBase64 = await FileSystemLegacy.readAsStringAsync(fileUri, {
      encoding: FileSystemLegacy.EncodingType.Base64,
      length: end - start,
      position: start,
    });

    let retries = 0;
    while (retries < 3) {
      try {
        const chunkResponse = await fetch(API.UPLOAD_CHUNK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            chunkIndex: ci,
            chunkData: chunkBase64,
          }),
        });

        if (!chunkResponse.ok) {
          throw new Error(`分块 ${ci} 上传失败: ${chunkResponse.status}`);
        }

        uploadedChunks.push(ci);
        break;
      } catch (e: any) {
        retries++;
        console.log(`[上传] 分块 ${ci} 第 ${retries} 次重试...`);
        if (retries >= 3) throw e;
        await new Promise((r) => setTimeout(r, 1000 * retries));
      }
    }

    const progress = Math.round((uploadedChunks.length / totalChunks) * 100);
    console.log(`[上传] 进度: ${progress}% (${ci + 1}/${totalChunks})`);
    if (onProgress) onProgress(progress);
  }

  // 5. ✅ 合并+分析（FastAPI 一步完成，不再需要单独的 analyze-barbell）
  console.log("[上传] 所有分块上传完成，请求合并分析...");
  const mergeResponse = await fetch(API.MERGE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: sessionId,
    }),
  });

  if (!mergeResponse.ok) {
    const errText = await mergeResponse.text().catch(() => "");
    throw new Error(`合并分析失败: ${mergeResponse.status} ${errText}`);
  }

  const mergeResult = await mergeResponse.json();
  if (!mergeResult.success) {
    throw new Error(mergeResult.error || "分析失败");
  }

  console.log("[上传] 合并分析完成:", mergeResult);
  return mergeResult;
};

// 以下函数保持不变
export const getAnalysisResult = async (
  taskId: string,
  maxRetries: number = 120,
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch(`${API.RESULT}/${taskId}`);
      if (response.status === 404) continue;
      if (!response.ok) throw new Error(`获取结果失败: ${response.status}`);
      const result = await response.json();
      if (result.status === "completed") return result;
      else if (result.status === "failed")
        throw new Error(result.error || "分析失败");
      console.log(
        `[轮询] 状态: ${result.status}, 进度: ${result.progress || "未知"}`,
      );
    } catch (error: any) {
      if (error.message?.includes("获取结果失败")) throw error;
      console.log(`[轮询] 网络错误，重试中... (${i + 1}/${maxRetries})`);
    }
  }
  throw new Error("分析超时，请稍后重试");
};

export const getVideoUrl = (taskId: string): string => {
  return `${API.VIDEO}/${taskId}`;
};

export const getSupportedExercises = async (): Promise<string[]> => {
  try {
    const response = await fetch(API.EXERCISES);
    if (!response.ok) throw new Error(`获取动作列表失败: ${response.status}`);
    const data = await response.json();
    return data.exercises || [];
  } catch (error) {
    console.error("获取支持的动作列表失败:", error);
    return [];
  }
};
