import { EmpresaForm } from "@/src/components/forms/EmpresaForm";
import { auth } from "@/src/firebase/config";
import { getEmpresaByUser, updateEmpresa } from "@/src/services/empresaService";
import { uploadImagem } from "@/src/services/uploadImagemService";
import { Empresa } from "@/src/types/empresa";
import { toastInfo } from "@/src/utils/toast";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const empresaInicial: Empresa = {
  nomeEmpresa: "",
  donoId: "",
  telefone: "",
  descricao: "",
  endereco: "",
  categoria: "",
  logoUrl: "",
  aberto: true,
  horario: "",
};

export default function EmpresaScreen() {
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [empresa, setEmpresa] = useState<Empresa>(empresaInicial);
  const [logoSelecionada, setLogoSelecionada] = useState("");
  const [mostrarMapa, setMostrarMapa] = useState(false);

  useEffect(() => {
    carregarEmpresa();
  }, []);

  async function carregarEmpresa() {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const dados = await getEmpresaByUser(user.uid);

      if (dados) {
        setEmpresa({
          ...empresaInicial,
          ...dados,
          donoId: dados.donoId || user.uid,
        });

        // se quiser já mostrar a logo existente no preview, pode deixar assim:
        setLogoSelecionada(dados.logoUrl || "");
      } else {
        setEmpresa({
          ...empresaInicial,
          donoId: user.uid,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelecionarImagem(uri: string) {
    setLogoSelecionada(uri);
  }

  function handleRemoverImagem() {
    setLogoSelecionada("");
    setEmpresa((prev) => ({
      ...prev,
      logoUrl: "",
    }));
  }

  async function handleSelecionarLocalizacao() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso à localização para continuar.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 0,
        timeInterval: 5000,
      });

      handleChange("localizacao", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      Alert.alert("Sucesso", "Localização capturada com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível obter a localização.");
    }
  }

  function handleChange<K extends keyof Empresa>(field: K, value: Empresa[K]) {
    setEmpresa((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function salvarEmpresa() {
    try {
      if (!empresa.nomeEmpresa.trim()) {
        return Alert.alert("Atenção", "Informe o nome da empresa.");
      }

      if (!empresa.telefone.trim()) {
        return Alert.alert("Atenção", "Informe o telefone.");
      }

      const user = auth.currentUser;
      if (!user) {
        return Alert.alert("Erro", "Usuário não autenticado.");
      }

      setSalvando(true);

      let logoUrl = empresa.logoUrl || "";

      // se escolheu uma nova imagem local, faz upload
      if (logoSelecionada && !logoSelecionada.startsWith("https")) {
        logoUrl = await uploadImagem(
          logoSelecionada,
          `empresas/${empresa.id || user.uid}/logo`,
        );
      }

      const dadosParaSalvar: Empresa = {
        ...empresa,
        donoId: user.uid,
        logoUrl,
      };

      const id = dadosParaSalvar.id;
      if (!id) {
        toastInfo("Erro: empresa sem id");
        return;
      }

      await updateEmpresa(id, dadosParaSalvar);

      setEmpresa((prev) => ({
        ...prev,
        logoUrl,
      }));

      // depois de salvar, deixa a imagem selecionada apontando pra URL final
      setLogoSelecionada(logoUrl);

      Alert.alert("Sucesso", "Dados da empresa salvos com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <EmpresaForm
          onSelecionarLocalizacao={handleSelecionarLocalizacao}
          empresa={empresa}
          imagemSelecionada={logoSelecionada}
          onChange={handleChange}
          onSelecionarImagem={handleSelecionarImagem}
          onRemoverImagem={handleRemoverImagem}
          onSubmit={salvarEmpresa}
          loading={salvando}
          isEdicao
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
