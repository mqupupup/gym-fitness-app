import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6FA",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },

  // 顶部标题区
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 14,
    paddingHorizontal: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    fontWeight: "400",
  },

  // 区域卡片
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
    letterSpacing: -0.2,
  },

  // 输入标签
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3C3C43",
    marginBottom: 8,
  },

  // 性别选择
  genderGroup: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  genderButtonActive: {
    borderColor: "#6A4C93",
    backgroundColor: "#F3F0FF",
  },
  genderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  genderTextActive: {
    color: "#6A4C93",
  },

  // 输入框容器
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDEDF0",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  unitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    paddingHorizontal: 16,
  },

  // 错误提示
  errorCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFE0E0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#FF3B30",
    lineHeight: 20,
  },

  // 结果卡片
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: -0.3,
  },

  // 结果项
  resultItem: {
    backgroundColor: "#F7F7F8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  resultExercise: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // 统计数据
  resultStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    gap: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E5EA",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  // 进度条
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#F7F6FA",
  },
  submitButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
