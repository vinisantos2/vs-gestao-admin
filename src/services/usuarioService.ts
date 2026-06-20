import { auth, db } from "@/src/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Usuario } from "../types/usuario";

export async function criarUsuario(data: any) {
  await setDoc(doc(db, "usuarios", data.id), data);
}
export async function getUsuarioAtual(): Promise<Usuario | null> {
  const user = auth.currentUser;

  if (!user) return null;

  const ref = doc(db, "usuarios", user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Usuario;
}

// ATUALIZAR USUARIO
export async function atualizarUsuario(usuario: Usuario) {
  if (!usuario.id) {
    throw new Error("Agendamento sem ID");
  }

  const ref = doc(db, "usuarios", usuario.id);

  const { id, ...dados } = usuario;

  await updateDoc(ref, dados);
}
