import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";

import { useAuth } from "@/src/context/AuthContext";
import { getFilaDoDia } from "@/src/services/agendamentoService";
import { getServicos } from "@/src/services/empresaService";

import { Agendamento } from "@/src/types/Agendamento";
import { Servico } from "@/src/types/servico";

import { FilaForm, FilaFormData } from "../forms/FilaForma";

type ServicoOption = {
  label: string;
  value: string;
};

type ModalFilaProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FilaFormData) => void;
};

export function ModalFila({ visible, onDismiss, onSubmit }: ModalFilaProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [servicos, setServicos] = useState<ServicoOption[]>([]);
  const [fila, setFila] = useState<Agendamento[]>([]);

  useEffect(() => {
    if (!visible || !user?.empresaId) return;

    async function carregarDados() {
      try {
        setLoading(true);

        const hoje = new Date().toISOString().split("T")[0];

        const [dadosServicos, dadosFila] = await Promise.all([
          getServicos(user.empresaId),
          getFilaDoDia(user.empresaId, hoje),
        ]);

        setServicos(
          dadosServicos.map((servico: Servico) => ({
            label: servico.nome,
            value: servico.id!,
          })),
        );

        setFila(dadosFila);

        console.log("Fila:", dadosFila);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [visible, user]);

  function handleSubmit(data: FilaFormData) {
    console.log("Posição na fila:", fila.length + 1);

    onSubmit(data);
    onDismiss();
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <FilaForm
          servicos={servicos}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
});
