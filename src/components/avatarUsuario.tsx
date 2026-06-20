import React from "react";
import { Alert, Image, TouchableOpacity } from "react-native";
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
  const avatar = require("@/assets/images/avatar.png");
  async function handleSelecionarImagem() {
    try {
      const uri = await selecionarImagem();

      if (!uri) return;

      if (onFotoSelecionada) {
        await onFotoSelecionada(uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={editavel ? 0.8 : 1}
      onPress={editavel ? handleSelecionarImagem : undefined}
      style={{
        backgroundColor: "rgb(34, 129, 160)",
        alignItems: "center",
        borderRadius: 20,
      }}
    >
      <Image
        source={foto ? { uri: foto } : require("@/assets/images/avatar.png")}
        style={{
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
        }}
      />
    </TouchableOpacity>
  );
}
