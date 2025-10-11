import React, { useEffect, useState } from "react";
import { getBancos } from "@/integrations/api";
import { toast } from "sonner";

export default function Bancos() {
  const [bancos, setBancos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBancos()
      .then(setBancos)
      .catch(() => toast.error("Error al cargar bancos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bancos</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {bancos.map((b) => (
              <tr key={b.id}>
                <td>{b.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
