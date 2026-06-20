import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

interface FormContainerProps {
  children: ReactNode;
}

export default function FormContainer({ children }: FormContainerProps) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    padding: 24,
  },
});
