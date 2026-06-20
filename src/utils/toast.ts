import Toast from "react-native-toast-message";

export function toastSuccess(message: string) {
  Toast.show({
    type: "success",
    text1: "Sucesso",
    text2: message,
  });
}

export function toastError(message: string) {
  Toast.show({
    type: "error",
    text1: "Erro",
    text2: message,
  });
}

export function toastInfo(message: string) {
  Toast.show({
    type: "info",
    text1: "Aviso",
    text2: message,
  });
}
