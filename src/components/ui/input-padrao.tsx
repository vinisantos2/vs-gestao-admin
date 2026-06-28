import { StyleSheet, TextInput, TextInputProps } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";

type TipoInput = "texto" | "data" | "hora" | "telefone" | "moeda" | "email";

interface InputPadraoProps extends TextInputProps {
  tipo?: TipoInput;
}

export default function InputPadrao({
  tipo = "texto",
  ...props
}: InputPadraoProps) {
  if (tipo === "data") {
    return (
      <MaskInput
        {...props}
        mask={Masks.DATE_DDMMYYYY}
        style={[styles.input, props.style]}
        placeholderTextColor="#9CA3AF"
      />
    );
  }

  if (tipo === "telefone") {
    return (
      <MaskInput
        {...props}
        mask={Masks.BRL_PHONE}
        keyboardType="phone-pad"
        style={[styles.input, props.style]}
        placeholderTextColor="#9CA3AF"
      />
    );
  }

  if (tipo === "hora") {
    return (
      <MaskInput
        {...props}
        mask={[/\d/, /\d/, ":", /\d/, /\d/]}
        keyboardType="numeric"
        style={[styles.input, props.style]}
        placeholderTextColor="#9CA3AF"
      />
    );
  }

  if (tipo === "moeda") {
    return (
      <MaskInput
        {...props}
        mask={Masks.BRL_CURRENCY}
        keyboardType="numeric"
        style={[styles.input, props.style]}
        placeholderTextColor="#9CA3AF"
      />
    );
  }
  if (tipo === "email") {
    return (
      <MaskInput
        {...props}
        keyboardType="email-address"
        style={[styles.input, props.style]}
        placeholderTextColor="#9CA3AF"
      />
    );
  }

  return (
    <TextInput
      {...props}
      multiline={props.multiline}
      style={[
        styles.input,
        props.multiline && styles.inputMultiline,
        props.style,
      ]}
      placeholderTextColor="#9CA3AF"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: "#000",
    fontSize: 16,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});
