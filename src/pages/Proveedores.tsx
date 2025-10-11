import React, { useEffect, useState } from "react";
import { getProveedores, deleteProveedor } from "@/integrations/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProveedores()
      .then(setProveedores)
      .catch(() => toast.error("Error al cargar proveedores"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.telefono}</td>
                <td>{p.email}</td>
                <td>
                  <Button size="sm" variant="destructive" onClick={async () => {
                    await deleteProveedor(p.id);
                    setProveedores(proveedores.filter(pr => pr.id !== p.id));
                    toast.success("Proveedor eliminado");
                  }}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
