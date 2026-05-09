import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },

  // 顶部标题卡片
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    lineHeight: 22,
  },

  // 区域卡片
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
    letterSpacing: 0.3,
  },

  // 输入组
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 10,
    letterSpacing: 0.3,
  },

  // 性别选择
  genderGroup: {
    flexDirection: "row",
    gap: 16,
  },
  genderButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#D1D1D6",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F9",
  },
  genderButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#E8F4FF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  genderText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3C3C43",
  },
  genderTextActive: {
    color: "#007AFF",
  },

  // 输入框容器
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F9",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: 20,
    fontSize: 17,
    fontWeight: "500",
    color: "#1C1C1E",
    letterSpacing: 0.3,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },

  // 错误提示
  errorCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFD9D9",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  errorIcon: {
    fontSize: 22,
  },
  errorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#FF3B30",
    lineHeight: 22,
  },

  // 结果卡片
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 28,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // 结果项
  resultItem: {
    backgroundColor: "#F8F8F9",
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultExercise: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: 0.3,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // 统计数据
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: 0.5,
  },

  // 进度条
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E5E5EA",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  submitButtonPressed: {
    backgroundColor: "#0056D6",
    transform: [{ scale: 0.98 }],
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
