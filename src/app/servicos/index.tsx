import LoadingModal from "@/src/components/ui/loading-modal";
import ServicoCard from "@/src/components/ui/servicos/ServicoCard";
import { ROTAS } from "@/src/constants/routes";
import { useAuth } from "@/src/context/AuthContext";
import { deletarServico, getServicos } from "@/src/services/empresaService";
import { deletarImagem } from "@/src/services/uploadImagemService";
import { Servico } from "@/src/types/servico";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const focused = useIsFocused();

  const { user } = useAuth();

  const empresaId = user?.empresaId || user?.id;

  const carregarServicos = useCallback(async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const data = await getServicos(empresaId);
      setServicos(data ?? []);
    } catch (error) {
      console.log("Erro ao carregar serviços:", error);
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    if (!focused || !empresaId) return;
    carregarServicos();
  }, [focused, empresaId, carregarServicos]);

  function handleEditar(servico: Servico) {
    router.push({
      pathname: ROTAS.privado.novoServico as any,
      params: { id: servico.id },
    });
  }

  function confirmarExclusao(servico: Servico) {
    Alert.alert(
      "Excluir serviço",
      `Tem certeza que deseja excluir "${servico.nome}"? Essa ação não poderá ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => handleExcluir(servico),
        },
      ],
    );
  }

  async function handleExcluir(servico: Servico) {
    if (!empresaId || !servico.id) return;

    Alert.alert("Deseja exclui esse serviço: " + servico.nome);

    try {
      setLoading(true);
      await deletarServico(empresaId, servico.id);
      if (servico.imagem) await deletarImagem(servico.imagem);

      setServicos((estadoAtual) =>
        estadoAtual.filter((item) => item.id !== servico.id),
      );
    } catch (error) {
      console.log("Erro ao excluir serviço:", error);
    } finally {
      setLoading(false);
    }
  }

  function renderEmptyState() {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum serviço cadastrado</Text>
        <Text style={styles.emptyText}>
          Cadastre seu primeiro serviço para começar a vender e organizar os
          atendimentos.
        </Text>

        <Pressable
          style={styles.emptyButton}
          onPress={() => router.push(ROTAS.privado.novoServico as any)}
        >
          <Text style={styles.emptyButtonText}>Cadastrar serviço</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Serviços</Text>

        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <ServicoCard
              servico={item}
              onEditar={handleEditar}
              onExcluir={confirmarExclusao}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            servicos.length === 0 && styles.listEmptyContent,
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <LoadingModal visible={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },

  listContent: {
    gap: 12,
    paddingBottom: 24,
  },

  listEmptyContent: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  emptyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
