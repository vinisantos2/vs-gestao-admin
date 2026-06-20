import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type LoadingModalProps = {
  visible: boolean;
};

export default function LoadingModal({ visible }: LoadingModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#2e6cff" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
  },
});
