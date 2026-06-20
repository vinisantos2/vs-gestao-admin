import { Text as RNText, StyleSheet, TextProps } from "react-native";

export default function TextPadrao(props: TextProps) {
  return <RNText {...props} style={[styles.text, props.style]} />;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#1F2937",
  },
});
