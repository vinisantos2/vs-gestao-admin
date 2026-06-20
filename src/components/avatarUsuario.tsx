import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { selecionarImagem } from "../services/uploadImagemService";

interface AvatarUsuarioProps {
  foto?: string;
  tamanho?: number;
  editavel?: boolean;
  onFotoSelecionada?: (uri: string) => Promise<void>;
}

export function AvatarUsuario({
  foto,
  tamanho = 120,
  editavel = false,
  onFotoSelecionada,
}: AvatarUsuarioProps) {
  const [preview, setPreview] = useState<string | undefined>(foto);

  useEffect(() => {
    setPreview(foto);
  }, [foto]);

  async function handleSelecionarImagem() {
    try {
      const uri = await selecionarImagem();

      if (!uri) return;

      // mostra preview na hora
      setPreview(uri);

      // envia para tela pai salvar/uploadar
      if (onFotoSelecionada) {
        await onFotoSelecionada(uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          preview ? { uri: preview } : require("@/assets/images/avatar.png")
        }
        style={{
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
        }}
      />

      {editavel && (
        <TouchableOpacity onPress={handleSelecionarImagem}>
          <Text style={styles.botaoTexto}>Atualizar foto</Text>
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
    color: "#0095f6", // azul estilo Instagram
    fontSize: 14,
    fontWeight: "600",
  },
});
