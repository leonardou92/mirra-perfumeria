import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getMarcas, createMarca, updateMarca, deleteMarca } from '@/integrations/api';
import { toast } from 'sonner';

export default function BrandMenu({ value, onChange }: { value?: number | null; onChange?: (id: number | null) => void }) {
  const [open, setOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getMarcas();
      const list = Array.isArray(data) ? data : (data?.data || []);
      setBrands(list);
    } catch (e) {
      console.error('Error cargando marcas', e);
      toast.error('No se pudieron cargar marcas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const startCreate = () => { setEditing(null); setName(''); setDesc(''); };
  const startEdit = (c: any) => { setEditing(c); setName(c.nombre || ''); setDesc(c.descripcion || ''); };

  const save = async () => {
    try {
      if (!name || !String(name).trim()) { toast.error('Nombre requerido'); return; }
      if (editing) {
        await updateMarca(editing.id, { nombre: name.trim(), descripcion: desc || null });
        toast.success('Marca actualizada');
      } else {
        await createMarca({ nombre: name.trim(), descripcion: desc || null });
        toast.success('Marca creada');
      }
      await fetch();
      setEditing(null); setName(''); setDesc('');
    } catch (err: any) {
      console.error('Error guardando marca', err);
      toast.error(err?.message || 'Error guardando marca');
    }
  };

  const remove = async (c: any) => {
    const ok = window.confirm(`Eliminar marca \"${c.nombre}\"?`);
    if (!ok) return;
    try {
      await deleteMarca(c.id);
      toast.success('Marca eliminada');
      if (onChange && value === c.id) onChange(null);
      await fetch();
    } catch (err: any) {
      console.error('Error eliminando marca', err);
      toast.error(err?.message || 'Error eliminando marca');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select value={value ?? ''} onChange={(e) => onChange && onChange(e.target.value ? Number(e.target.value) : null)} className="rounded border px-2 py-1">
        <option value="">-- Marca --</option>
        {brands.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </select>
      <Button variant="outline" size="sm" onClick={() => { setOpen(true); fetch(); }}>Gestionar</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcas</DialogTitle>
            <DialogDescription>Lista de marcas. Puedes crear, editar o eliminar.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Descripción (opcional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <Button onClick={save}>{editing ? 'Actualizar' : 'Crear'}</Button>
              <Button variant="ghost" onClick={startCreate}>Nuevo</Button>
            </div>

            <div className="max-h-60 overflow-auto mt-2">
              {loading ? <div>Cargando...</div> : (
                <ul className="space-y-2">
                  {brands.map((c) => (
                    <li key={c.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{c.nombre}</div>
                        <div className="text-xs text-muted-foreground">{c.descripcion}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => startEdit(c)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(c)}>Eliminar</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
