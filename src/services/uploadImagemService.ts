import { storage } from "@/src/firebase/config";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function selecionarImagem() {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissao.granted) {
    throw new Error("Permissão negada");
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });

  if (resultado.canceled) {
    return null;
  }

  return resultado.assets[0].uri;
}

export async function uploadImagem(
  uri: string,
  caminho: string,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const arquivoRef = ref(storage, caminho);

  await uploadBytes(arquivoRef, blob);

  return await getDownloadURL(arquivoRef);
}
