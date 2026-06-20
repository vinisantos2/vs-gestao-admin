import TextPadrao from "@/src/components/ui/text";
import { StyleSheet, View } from "react-native";
//serve como um historico de serviços prestados
export default function Comanda() {
  return (
    <View style={styles.content}>
      <TextPadrao>comanda</TextPadrao>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});
