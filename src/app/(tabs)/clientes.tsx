import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Cliente = {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
};

const CLIENTES_MOCK: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(75) 99999-1111",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria@email.com",
    telefone: "(75) 99999-2222",
  },
  {
    id: "3",
    nome: "Carlos Souza",
    email: "carlos@email.com",
    telefone: "(75) 99999-3333",
  },
  {
    id: "4",
    nome: "Ana Beatriz",
    email: "ana@email.com",
    telefone: "(75) 99999-4444",
  },
  {
    id: "5",
    nome: "Fernanda Lima",
    email: "fernanda@email.com",
    telefone: "(75) 99999-5555",
  },
];

export default function ClientesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Clientes</Text>
        <Text style={styles.subtitulo}>
          {CLIENTES_MOCK.length} clientes cadastrados
        </Text>
      </View>

      <FlatList
        data={CLIENTES_MOCK}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.nome.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.nome}>{item.nome}</Text>

              {!!item.email && <Text style={styles.detalhe}>{item.email}</Text>}

              {!!item.telefone && (
                <Text style={styles.detalhe}>{item.telefone}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptyText}>
              Os clientes aparecerão aqui quando forem cadastrados.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitulo: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
  },
  lista: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  detalhe: {
    marginTop: 3,
    fontSize: 14,
    color: "#64748b",
  },
  emptyBox: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
});
