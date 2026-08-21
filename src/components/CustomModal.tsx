import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  icon?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  children,
  icon = "information-circle-outline",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* 顶部图标 */}
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={28} color="#6A4C93" />
          </View>

          {/* 标题 */}
          <Text style={styles.modalTitle}>{title}</Text>

          {/* 内容：优先 children，其次 message */}
          {children ? (
            <View style={styles.contentContainer}>{children}</View>
          ) : message ? (
            <Text style={styles.modalText}>{message}</Text>
          ) : null}

          {/* 按钮 */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>我知道了</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 32,
  },
  modalView: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 15,
    color: "#3C3C43",
    lineHeight: 22,
  },
  contentContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6A4C93",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#5A3D80",
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default CustomModal;
