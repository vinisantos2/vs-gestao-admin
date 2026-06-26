import { auth } from "@/src/firebase/config";
import { getEmpresaByUser } from "@/src/services/empresaService";
import { Empresa } from "@/src/types/empresa";
import { useEffect, useState } from "react";

export function useEmpresAdmin() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEmpresa() {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        setLoading(false);
        return;
      }

      const data = await getEmpresaByUser(userId);

      setEmpresa(data);
      setLoading(false);
    }

    carregarEmpresa();
  }, []);

  return {
    empresa,
    loading,
    setEmpresa,
  };
}
