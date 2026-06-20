import FormContainer from "@/src/components/ui/form-container";
import InputPadrao from "@/src/components/ui/input-padrao";
import { ROTAS } from "@/src/constants/routes";
import { useAuth } from "@/src/context/AuthContext";
import {
  atualizarServico,
  criarServico,
  getServicoById,
} from "@/src/services/empresaService";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

type ServicoFormData = {
  nome: string;
  duracao: string;
  preco: string;
  imagem: string;
  ativo: boolean;
};

const servicoInicial: ServicoFormData = {
  nome: "",
  duracao: "",
  preco: "",
  imagem: "",
  ativo: true,
};

export default function CadastroServico() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { user } = useAuth();
  const empresaId = user?.empresaId || user?.id;

  const [servico, setServico] = useState<ServicoFormData>(servicoInicial);
  const [loading, setLoading] = useState(false);

  const isEdicao = !!id;

  function updateField(field: keyof ServicoFormData, value: string | boolean) {
    setServico((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        "Permissão negada",
        "Permita acesso às fotos para escolher uma imagem.",
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const imagem = resultado.assets?.[0]?.uri;
    if (!imagem) return;

    updateField("imagem", imagem);
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
          nome: data.nome ?? "",
          duracao: String(data.duracao ?? ""),
          preco: String(data.preco ?? ""),
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

    const nome = servico.nome.trim();
    const duracao = Number(servico.duracao);
    const preco = Number(servico.preco.replace(",", "."));

    if (!nome || !servico.duracao || !servico.preco) {
      Alert.alert("Atenção", "Preencha nome, duração e preço.");
      return;
    }

    if (Number.isNaN(duracao) || duracao <= 0) {
      Alert.alert("Atenção", "Informe uma duração válida em minutos.");
      return;
    }

    if (Number.isNaN(preco) || preco <= 0) {
      Alert.alert("Atenção", "Informe um preço válido.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        empresaId,
        nome,
        duracao,
        preco,
        imagem: servico.imagem || "",
        ativo: servico.ativo,
      };

      if (isEdicao) {
        await atualizarServico({
          id: String(id),
          ...payload,
        });

        Alert.alert("Sucesso", "Serviço atualizado com sucesso.");
      } else {
        await criarServico(payload);
        Alert.alert("Sucesso", "Serviço cadastrado com sucesso.");
      }

      setServico(servicoInicial);
      router.replace(ROTAS.privado.servicos as any);
    } catch (error) {
      console.log("Erro ao salvar serviço:", error);
      Alert.alert("Erro", "Não foi possível salvar o serviço.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormContainer>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
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

          <View style={styles.card}>
            {/* IMAGEM */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Imagem do serviço</Text>

              <Pressable style={styles.imageBox} onPress={escolherImagem}>
                {servico.imagem ? (
                  <Image
                    source={{ uri: servico.imagem }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderTitle}>
                      Adicionar imagem
                    </Text>
                    <Text style={styles.imagePlaceholderText}>
                      Toque para selecionar uma foto do serviço
                    </Text>
                  </View>
                )}
              </Pressable>

              {servico.imagem ? (
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => updateField("imagem", "")}
                >
                  <Text style={styles.removeImageText}>Remover imagem</Text>
                </Pressable>
              ) : null}
            </View>

            {/* NOME */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome do serviço</Text>
              <InputPadrao
                placeholder="Ex: Corte masculino"
                value={servico.nome}
                onChangeText={(v) => updateField("nome", v)}
                style={styles.input}
              />
            </View>

            {/* DURAÇÃO E PREÇO */}
            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Duração</Text>
                <InputPadrao
                  placeholder="30"
                  value={servico.duracao}
                  onChangeText={(v) => updateField("duracao", v)}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Text style={styles.helperText}>Em minutos</Text>
              </View>

              <View style={[styles.fieldGroup, styles.fieldHalf]}>
                <Text style={styles.label}>Preço</Text>
                <InputPadrao
                  placeholder="35,00"
                  value={servico.preco}
                  onChangeText={(v) => updateField("preco", v)}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Text style={styles.helperText}>Valor cobrado</Text>
              </View>
            </View>

            {/* SWITCH */}
            <View style={styles.statusCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>Serviço disponível</Text>
                <Text style={styles.statusSubtitle}>
                  Desative se não quiser que esse serviço apareça para novos
                  agendamentos.
                </Text>
              </View>

              <Switch
                value={servico.ativo}
                onValueChange={(value) => updateField("ativo", value)}
                trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
                thumbColor={servico.ativo ? "#2563EB" : "#f3f4f6"}
              />
            </View>

            {/* BOTÃO */}
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSalvar}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {isEdicao ? "Atualizar serviço" : "Salvar serviço"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  content: {
    padding: 20,
    paddingBottom: 32,
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },

  fieldHalf: {
    flex: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },

  helperText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },

  imageBox: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  imagePlaceholderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  imagePlaceholderText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },

  removeImageButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  removeImageText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 13,
  },

  statusCard: {
    marginTop: 8,
    marginBottom: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  statusSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
