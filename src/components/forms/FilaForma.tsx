import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SelectPadrao from "../select-padrao";

type ServicoOption = {
  label: string;
  value: string;
};

export type FilaFormData = {
  clienteNome: string;
  clienteTelefone: string;
  servicoId: string;
  observacao: string;
};

type Props = {
  servicos: ServicoOption[];
  loading?: boolean;
  initialValues?: Partial<FilaFormData>;
  onSubmit: (data: FilaFormData) => void;
};

const valoresIniciais: FilaFormData = {
  clienteNome: "",
  clienteTelefone: "",
  servicoId: "",
  observacao: "",
};

export function FilaForm({
  servicos,
  loading = false,
  initialValues,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FilaFormData>(valoresIniciais);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...valoresIniciais,
        ...initialValues,
      });
    }
  }, [initialValues]);

  function alterar<K extends keyof FilaFormData>(
    campo: K,
    valor: FilaFormData[K],
  ) {
    setForm((old) => ({
      ...old,
      [campo]: valor,
    }));
  }

  function enviar() {
    onSubmit(form);
  }

  return (
    <View style={styles.container}>
      <View style={styles.grupo}>
        <Text style={styles.label}>
          Nome do cliente <Text style={styles.opcional}>(Opcional)</Text>
        </Text>

        <TextInput
          placeholder="Digite o nome"
          value={form.clienteNome}
          onChangeText={(v) => alterar("clienteNome", v)}
          style={styles.input}
        />
      </View>

      <View style={styles.grupo}>
        <Text style={styles.label}>
          Telefone <Text style={styles.opcional}>(Opcional)</Text>
        </Text>

        <TextInput
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          value={form.clienteTelefone}
          onChangeText={(v) => alterar("clienteTelefone", v)}
          style={styles.input}
        />
      </View>

      <View style={styles.grupo}>
        <Text style={styles.label}>Serviço</Text>

        <SelectPadrao
          value={form.servicoId}
          onValueChange={(v) => alterar("servicoId", v)}
          options={servicos}
        />
      </View>

      <View style={styles.grupo}>
        <Text style={styles.label}>
          Observação <Text style={styles.opcional}>(Opcional)</Text>
        </Text>

        <TextInput
          placeholder="Opcional"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.observacao}
          onChangeText={(v) => alterar("observacao", v)}
          style={[styles.input, styles.textArea]}
        />
      </View>

      <TouchableOpacity
        disabled={loading}
        style={styles.botao}
        onPress={enviar}
      >
        <Text style={styles.textoBotao}>
          {loading ? "Salvando..." : "Adicionar à fila"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 20,
  },
  opcional: {
    fontSize: 13,
    fontWeight: "400",
    color: "#9CA3AF",
  },
  grupo: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    height: 54,
    fontSize: 16,
  },

  textArea: {
    height: 110,
    paddingTop: 14,
  },

  botao: {
    marginTop: 10,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#031b3e",
    justifyContent: "center",
    alignItems: "center",
  },

  textoBotao: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
