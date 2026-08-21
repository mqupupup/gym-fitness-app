import { StyleSheet } from "react-native";

export const powerliftingStyles = StyleSheet.create({
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
  inputGroup: {
    marginBottom: 14,
  },
  inputGroupLast: {
    marginBottom: 0,
  },
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
    color: "#8E8E93",
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#6A4C93",
  },

  // 输入框
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

  // 系数选择
  coefficientOption: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  coefficientOptionSelected: {
    borderColor: "#6A4C93",
    backgroundColor: "#F3F0FF",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3C3C43",
  },
  optionTitleSelected: {
    color: "#6A4C93",
  },
  optionDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
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
    fontSize: 19,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  resultSummary: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDF0",
  },
  summaryItemLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  levelSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 10,
  },
  levelBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  coefficientDetail: {
    backgroundColor: "#F7F6FA",
    borderRadius: 12,
    padding: 16,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 6,
  },
  detailTextLast: {
    marginBottom: 0,
  },

  // 底部按钮
  footer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    backgroundColor: "#F7F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E5",
  },
  submitButton: {
    backgroundColor: "#6A4C93",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
