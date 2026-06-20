import { brParaISO, isoParaBR } from "@/src/utils/date";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

type Props = {
  dataSelecionada: string;
  onSelecionarData: (dataBR: string) => void;

  // 🔥 NOVO: lista de datas que têm agendamento
  datasComAgendamento?: string[]; // formato BR: "DD/MM/YYYY"
};

export default function CalendarPicker({
  dataSelecionada,
  onSelecionarData,
  datasComAgendamento = [],
}: Props) {
  const [aberto, setAberto] = useState(false);

  function handleSelecionar(day: any) {
    const dataBR = isoParaBR(day.dateString);
    onSelecionarData(dataBR);
    setAberto(false);
  }

  // 🔥 monta marcações
  const markedDates = useMemo(() => {
    const marks: any = {};

    // dias com agendamento (bolinha)
    datasComAgendamento.forEach((data) => {
      const iso = brParaISO(data);

      marks[iso] = {
        marked: true,
        dotColor: "#2563EB",
      };
    });

    // dia selecionado (sobrescreve)
    if (dataSelecionada) {
      const isoSelecionado = brParaISO(dataSelecionada);

      marks[isoSelecionado] = {
        ...(marks[isoSelecionado] || {}),
        selected: true,
        selectedColor: "#2563EB",
      };
    }

    return marks;
  }, [datasComAgendamento, dataSelecionada]);

  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <TouchableOpacity onPress={() => setAberto(!aberto)} style={styles.box}>
        <Text style={styles.label}>Data</Text>

        <Text style={styles.value}>
          📅 {dataSelecionada || "Selecionar data"}{" "}
          <Text style={styles.arrow}>{aberto ? "▲" : "▼"}</Text>
        </Text>
      </TouchableOpacity>

      {/* CALENDÁRIO */}
      {aberto && (
        <View style={styles.calendarBox}>
          <Calendar
            onDayPress={handleSelecionar}
            markedDates={markedDates}
            markingType={"dot"} // 🔥 ativa bolinhas
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },

  box: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  arrow: {
    color: "#777",
  },

  calendarBox: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
});
