import { ServicoForm } from "@/src/components/forms/ServicoForm";
import { useAuth } from "@/src/context/AuthContext";
import {
  atualizarServico,
  criarServico,
  getServicoById,
} from "@/src/services/empresaService";
import { uploadImagem } from "@/src/services/uploadImagemService";
import { Servico } from "@/src/types/servico";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const servicoInicial: Servico = {
  id: "",
  imagem: "",
  empresaId: "",
  nome: "",
  preco: "",
  duracao: 0,
  ativo: true,
};

export default function CadastroServico() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { user } = useAuth();
  const empresaId = user?.empresaId || user?.id;

  const [servico, setServico] = useState<Servico>(servicoInicial);
  const [loading, setLoading] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState("");

  const isEdicao = !!id;

  function updateField<K extends keyof Servico>(field: K, value: Servico[K]) {
    setServico((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  useEffect(() => {
    if (!isEdicao || !empresaId) return;

    async function carregarServico() {
      try {
        setLoading(true);

        const data = await getServicoById(empresaId, String(id));

        if (!data) {
          Alert.alert("Serviço não encontrado");
          router.back();
          return;
        }

        setServico({
          id: data.id ?? String(id),
          empresaId: data.empresaId ?? empresaId,
          nome: data.nome ?? "",
          preco: data.preco ?? 0,
          duracao: data.duracao ?? 0,
          imagem: data.imagem ?? "",
          ativo: data.ativo ?? true,
        });
      } catch (error) {
        console.log("Erro ao carregar serviço:", error);
        Alert.alert("Erro", "Não foi possível carregar o serviço.");
      } finally {
        setLoading(false);
      }
    }

    carregarServico();
  }, [empresaId, id, isEdicao, router]);

  async function handleSalvar() {
    if (!empresaId) {
      Alert.alert("Erro", "Empresa não encontrada.");
      return;
    }

    if (
      !servico.nome.trim() ||
      servico.duracao <= 0 ||
      servico.preco === "" ||
      servico.preco === "R$"
    ) {
      Alert.alert("Atenção", "Preencha nome, duração e preço.");
      return;
    }

    if (Number.isNaN(servico.duracao) || servico.duracao <= 0) {
      Alert.alert("Atenção", "Informe uma duração válida em minutos.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // EDIÇÃO
      // =========================
      if (isEdicao) {
        let imagemUrl = servico.imagem || "";

        if (imagemSelecionada && !imagemSelecionada.startsWith("https")) {
          imagemUrl = await uploadImagem(
            imagemSelecionada,
            `empresas/${empresaId}/servicos/${String(id)}/capa.jpg`,
          );
        }

        await atualizarServico({
          ...servico,
          id: String(id),
          empresaId,
          nome: servico.nome.trim(),
          imagem: imagemUrl,
        });

        Alert.alert("Sucesso", "Serviço atualizado com sucesso.");
      } else {
        // =========================
        // CRIAÇÃO
        // =========================
        const servicoId = await criarServico({
          empresaId,
          nome: servico.nome.trim(),
          preco: servico.preco,
          duracao: servico.duracao,
          ativo: servico.ativo,
          imagem: "",
        });

        if (!servicoId) {
          throw new Error("Não foi possível obter o ID do serviço criado.");
        }

        if (imagemSelecionada) {
          const imagemUrl = await uploadImagem(
            imagemSelecionada,
            `empresas/${empresaId}/servicos/${servicoId}/capa.jpg`,
          );

          await atualizarServico({
            ...servico,
            id: servicoId,
            empresaId,
            nome: servico.nome.trim(),
            imagem: imagemUrl,
          });
        }

        Alert.alert("Sucesso", "Serviço cadastrado com sucesso.");
      }

      setServico(servicoInicial);
      setImagemSelecionada("");
      router.back();
    } catch (error) {
      console.log("Erro ao salvar serviço:", error);
      Alert.alert("Erro", "Não foi possível salvar o serviço.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEdicao ? "Editar serviço" : "Novo serviço"}
          </Text>

          <Text style={styles.subtitle}>
            {isEdicao
              ? "Atualize as informações do serviço cadastrado."
              : "Cadastre um novo serviço para disponibilizar nos agendamentos."}
          </Text>
        </View>

        <ServicoForm
          servico={servico}
          imagemSelecionada={imagemSelecionada}
          onSelecionarImagem={setImagemSelecionada}
          onRemoverImagem={() => {
            setImagemSelecionada("");
            updateField("imagem", "");
          }}
          onChange={updateField}
          onSubmit={handleSalvar}
          loading={loading}
          isEdicao={isEdicao}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
});
