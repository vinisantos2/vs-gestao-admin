import { auth } from "@/src/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export async function registrarUsuario(email: string, senha: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, senha);
  return cred.user;
}

export async function login(email: string, senha: string) {
  const cred = await signInWithEmailAndPassword(auth, email, senha);
  return cred.user;
}

export function getUsuarioLogado() {
  return auth.currentUser;
}

export async function logout() {
  await signOut(auth);
}
