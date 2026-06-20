import { registrarUsuario } from "./authService";
import { criarEmpresa } from "./empresaService";
import { criarUsuario } from "./usuarioService";

export async function cadastrarParceiro(
  nome: string,
  email: string,
  senha: string,
  nomeEmpresa: string,
  telefone: string,
) {
  const user = await registrarUsuario(email, senha);

  const empresaId = await criarEmpresa({
    telefone: telefone,
    nomeEmpresa: nomeEmpresa,
    donoId: user.uid,
    criadoEm: new Date(),
  });

  await criarUsuario({
    id: user.uid,
    nome,
    email,
    tipo: "empresa",
    empresaId,
  });

  return user;
}
