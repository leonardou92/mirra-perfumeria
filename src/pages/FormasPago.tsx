import React, { useEffect, useState } from "react";
import { getFormasPago, createFormaPago } from "@/integrations/api";
import { toast } from "sonner";

export default function FormasPago() {
  const [formas, setFormas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFormasPago()
      .then(setFormas)
      .catch(() => toast.error("Error al cargar formas de pago"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const nueva = await createFormaPago({ nombre });
      setFormas([...formas, nueva]);
      setNombre("");
      toast.success("Forma de pago creada");
    } catch (err: any) {
      setError(err.message || "Error al crear forma de pago");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Formas de Pago</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            className="border rounded px-2 py-1"
            required
            placeholder="Ej: Transferencia, Efectivo, Tarjeta"
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-1 rounded">Agregar</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
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
            {formas.map((f) => (
              <tr key={f.id}>
                <td>{f.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
