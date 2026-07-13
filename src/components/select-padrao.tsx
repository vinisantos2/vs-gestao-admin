import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

type Option = {
  label: string;
  value: string;
};

type SelectPadraoProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
};

export default function SelectPadrao({
  value,
  onValueChange,
  options,
}: SelectPadraoProps) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        dropdownIconColor="#2563EB"
        style={styles.picker}
      >
        <Picker.Item label="Todas as categorias" value="" color="#9CA3AF" />

        {options.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  picker: {
    height: 55,
    color: "#111827",
  },
});
