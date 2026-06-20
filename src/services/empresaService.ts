import { db } from "@/src/firebase/config";
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
import { Empresa } from "../types/empresa";
import { ServiceCreate, Servico } from "../types/servico";

const empresasRef = collection(db, "empresas");

export async function criarEmpresa(empresa: Empresa) {
  const docRef = await addDoc(empresasRef, {
    ...empresa,
    criadoEm: new Date(),
  });

  return docRef.id;
}

export async function getEmpresas(): Promise<Empresa[]> {
  try {
    const empresasRef = collection(db, "empresas");

    const snapshot = await getDocs(empresasRef);

    const empresas: Empresa[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Empresa[];

    return empresas;
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    return [];
  }
}

export async function getEmpresa(empresaId: string): Promise<Empresa | null> {
  const ref = doc(db, "empresas", empresaId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Empresa;
}

export async function criarServico(data: ServiceCreate) {
  if (!data.empresaId) {
    throw new Error("Empresa não identificada");
  }

  try {
    const docRef = await addDoc(
      collection(db, "empresas", data.empresaId, "servicos"),
      {
        ...data,
        createdAt: new Date(),
      },
    );

    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw error;
  }
}

export async function getEmpresaByUser(
  userId: string,
): Promise<Empresa | null> {
  const q = query(collection(db, "empresas"), where("donoId", "==", userId));

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  } as Empresa;
}

export async function updateEmpresa(empresaId: string, data: Partial<Empresa>) {
  try {
    const ref = doc(db, "empresas", empresaId);

    await updateDoc(ref, {
      ...data,
      atualizadoEm: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    throw error;
  }
}

export async function getServicos(empresaId: string): Promise<Servico[]> {
  try {
    const ref = collection(db, "empresas", empresaId, "servicos");

    const snapshot = await getDocs(ref);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        empresaId, // 🔥 já vem pronto
        ...data,
      } as Servico;
    });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return [];
  }
}

export async function getServicoById(
  empresaId: string,
  id: string,
): Promise<Servico | null> {
  const ref = doc(db, "empresas", empresaId, "servicos", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as Servico;
}

export async function atualizarServico(servico: Servico) {
  const ref = doc(db, "empresas", servico.empresaId, "servicos", servico.id);

  await updateDoc(ref, {
    nome: servico.nome,
    preco: servico.preco,
    duracao: servico.duracao,
  });
}

export async function deletarServico(empresaId: string, servicoId: string) {
  try {
    const ref = doc(db, "empresas", empresaId, "servicos", servicoId);

    await deleteDoc(ref);
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    throw error;
  }
}
