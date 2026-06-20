// Converte YYYY-MM-DD → DD/MM/YYYY
export function isoParaBR(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Converte DD/MM/YYYY → YYYY-MM-DD
export function brParaISO(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

// Retorna hoje no formato DD/MM/YYYY
export function hojeBR(): string {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// Retorna hoje no formato ISO (YYYY-MM-DD)
export function hojeISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function isDataPassada(data: string) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [dia, mes, ano] = data.split("/").map(Number);
  const dataSelecionada = new Date(ano, mes - 1, dia);

  return dataSelecionada < hoje;
}

export function isHorarioPassado(data: string, horario: string) {
  const agora = new Date();

  const [dia, mes, ano] = data.split("/").map(Number);
  const [hora, minuto] = horario.split(":").map(Number);

  const dataHora = new Date(ano, mes - 1, dia, hora, minuto);

  return dataHora < agora;
}
