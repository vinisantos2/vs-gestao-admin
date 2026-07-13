import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Agendamento, AgendamentoCreate } from "../types/Agendamento";

const collectionRef = collection(db, "agendamentos");

// CRIAR AGENDAMENTO
export async function criarAgendamento(data: Omit<AgendamentoCreate, "id">) {
  const docRef = await addDoc(collectionRef, data);

  return {
    id: docRef.id,
    ...data,
  };
}

// BUSCAR AGENDAMENTOS DO USUÁRIO
export async function buscarAgendamentos(
  userId: string,
): Promise<Agendamento[]> {
  const q = query(collectionRef, where("userId", "==", userId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Agendamento, "id">),
  }));
}

// BUSCAR AGENDAMENTOS POR DATA
export async function buscarAgendamentosPorData(data: string) {
  const q = query(collectionRef, where("data", "==", data));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Agendamento, "id">),
  }));
}

// ATUALIZAR AGENDAMENTO
export async function atualizarAgendamento(agendamento: Agendamento) {
  if (!agendamento.id) {
    throw new Error("Agendamento sem ID");
  }

  const ref = doc(db, "agendamentos", agendamento.id);

  const { id, ...dados } = agendamento;

  await updateDoc(ref, dados);
}

// EXCLUIR AGENDAMENTO
export async function excluirAgendamento(id: string) {
  const ref = doc(db, "agendamentos", id);

  await deleteDoc(ref);
}

export async function getAgendamentoById(
  empresaId: string,
  id: string,
): Promise<Agendamento | null> {
  const ref = doc(db, "agendamentos", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as Agendamento),
  };
}
export async function getAgendamentosEmpresa(
  empresaId: string,
): Promise<Agendamento[]> {
  try {
    const ref = collection(db, "agendamentos");

    const q = query(ref, where("empresaId", "==", empresaId));

    const snapshot = await getDocs(q);

    const dados: Agendamento[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Agendamento),
    }));

    return dados;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
}

export async function getAgendamentosByData(
  empresaId: string,
  data: string,
): Promise<Agendamento[]> {
  try {
    const ref = collection(db, "agendamentos");

    const q = query(
      ref,
      where("empresaId", "==", empresaId),
      where("data", "==", data),
      where("status", "==", "confirmado"), // 🔥 importante
    );

    const snapshot = await getDocs(q);

    const agendamentos: Agendamento[] = snapshot.docs.map((doc) => {
      const dataDoc = doc.data();

      return {
        id: doc.id,
        ...dataDoc,
      } as Agendamento;
    });

    return agendamentos;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
}

export async function getFilaDoDia(
  empresaId: string,
  data: string,
): Promise<Agendamento[]> {
  const ref = collection(db, "agendamentos");

  const q = query(
    ref,
    where("empresaId", "==", empresaId),
    where("data", "==", data),
    where("origem", "==", "fila"),
    where("status", "==", "aguardando"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Agendamento[];
}
