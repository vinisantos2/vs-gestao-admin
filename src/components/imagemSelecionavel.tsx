import { selecionarImagem } from "@/src/services/uploadImagemService";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ImagemSelecionavelProps {
  imagem?: string;
  largura?: number;
  altura?: number;
  editavel?: boolean;
  circular?: boolean;
  textoBotao?: string;
  placeholder?: ImageSourcePropType;
  onImagemSelecionada?: (uri: string) => Promise<void> | void;
}

export function ImagemSelecionavel({
  imagem,
  largura = 120,
  altura = 120,
  editavel = false,
  circular = false,
  textoBotao = "Alterar imagem",
  placeholder = require("@/assets/images/avatar.png"),
  onImagemSelecionada,
}: ImagemSelecionavelProps) {
  const [preview, setPreview] = useState<string | undefined>(imagem);

  useEffect(() => {
    setPreview(imagem);
  }, [imagem]);

  async function handleSelecionarImagem() {
    try {
      const uri = await selecionarImagem();

      if (!uri) return;

      setPreview(uri);

      if (onImagemSelecionada) {
        await onImagemSelecionada(uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={preview ? { uri: preview } : placeholder}
        style={{
          width: largura,
          height: altura,
          borderRadius: circular ? largura / 2 : 12,
        }}
        resizeMode="cover"
      />

      {editavel && (
        <TouchableOpacity onPress={handleSelecionarImagem}>
          <Text style={styles.botaoTexto}>{textoBotao}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  botaoTexto: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});
