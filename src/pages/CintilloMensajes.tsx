import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { TableSkeleton } from '@/components/admin-skeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createMensajeCintillo, deleteMensajeCintillo, getMensajesCintillo, updateMensajeCintillo, type CintilloMensaje } from '@/integrations/api';
import { parseApiError } from '@/lib/utils';
import { Loader2, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type MessageForm = Pick<CintilloMensaje, 'texto' | 'orden' | 'activo'>;

const emptyForm: MessageForm = { texto: '', orden: 0, activo: true };

export default function CintilloMensajes() {
  const [messages, setMessages] = useState<CintilloMensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MessageForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    try {
      const result = await getMensajesCintillo();
      setMessages(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error(parseApiError(error) || 'No se pudieron cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, orden: messages.length });
    setDialogOpen(true);
  }

  function openEdit(message: CintilloMensaje) {
    setEditingId(message.id);
    setForm({ texto: message.texto, orden: message.orden, activo: message.activo });
    setDialogOpen(true);
  }

  async function saveMessage() {
    const payload = { ...form, texto: form.texto.trim(), orden: Number(form.orden) };
    if (!payload.texto) return toast.error('Escribe el mensaje que se mostrará');
    if (payload.texto.length > 280) return toast.error('El mensaje no puede superar 280 caracteres');
    if (!Number.isInteger(payload.orden)) return toast.error('El orden debe ser un número entero');

    setSaving(true);
    try {
      if (editingId) {
        await updateMensajeCintillo(editingId, payload);
        toast.success('Mensaje actualizado');
      } else {
        await createMensajeCintillo(payload);
        toast.success('Mensaje creado');
      }
      setDialogOpen(false);
      await loadMessages();
    } catch (error) {
      toast.error(parseApiError(error) || 'No se pudo guardar el mensaje');
    } finally {
      setSaving(false);
    }
  }

  async function removeMessage(message: CintilloMensaje) {
    if (!window.confirm(`¿Eliminar el mensaje “${message.texto}”?`)) return;
    try {
      await deleteMensajeCintillo(message.id);
      toast.success('Mensaje eliminado');
      await loadMessages();
    } catch (error) {
      toast.error(parseApiError(error) || 'No se pudo eliminar el mensaje');
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Megaphone className="h-6 w-6 text-primary" /> Mensajes del cintillo
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Administra las frases y emojis que aparecen sobre el menú de la tienda.</p>
          </div>
          <Button className="h-11 gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nuevo mensaje
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? <TableSkeleton columns={5} /> : messages.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Megaphone className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 font-medium">Todavía no hay mensajes</p>
                <p className="mt-1 text-sm text-muted-foreground">Crea el primero para mostrarlo en la tienda.</p>
              </div>
            ) : (
              <>
                <div className="divide-y sm:hidden">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 font-medium">{message.texto}</p>
                        <Badge variant={message.activo ? 'success' : 'secondary'}>{message.activo ? 'Activo' : 'Inactivo'}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Posición: {message.orden}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="min-h-10 flex-1 gap-2" onClick={() => openEdit(message)}><Pencil className="h-4 w-4" /> Editar</Button>
                        <Button variant="destructive" className="min-h-10 flex-1 gap-2" onClick={() => void removeMessage(message)}><Trash2 className="h-4 w-4" /> Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Orden</TableHead>
                        <TableHead>Mensaje</TableHead>
                        <TableHead className="w-28">Estado</TableHead>
                        <TableHead className="w-36 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="tabular-nums text-muted-foreground">{message.orden}</TableCell>
                          <TableCell className="font-medium">{message.texto}</TableCell>
                          <TableCell><Badge variant={message.activo ? 'success' : 'secondary'}>{message.activo ? 'Activo' : 'Inactivo'}</Badge></TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" aria-label="Editar mensaje" title="Editar" onClick={() => openEdit(message)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" aria-label="Eliminar mensaje" title="Eliminar" onClick={() => void removeMessage(message)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[95dvh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar mensaje' : 'Nuevo mensaje'}</DialogTitle>
              <DialogDescription>Escribe el mensaje y los emojis directamente en el texto. El orden define su posición en el cintillo.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="ticker-text" className="text-sm font-medium">Texto</label>
                <textarea
                  id="ticker-text"
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.texto}
                  onChange={(event) => setForm({ ...form, texto: event.target.value })}
                  placeholder="Encuentra la fragancia que habla de ti"
                  maxLength={280}
                />
                <p className="text-right text-xs text-muted-foreground">{form.texto.length}/280</p>
              </div>
              <div className="max-w-32 space-y-2">
                <div className="space-y-2">
                  <label htmlFor="ticker-order" className="text-sm font-medium">Orden</label>
                  <Input id="ticker-order" type="number" step="1" value={form.orden} onChange={(event) => setForm({ ...form, orden: Number(event.target.value) })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-3">
                <label htmlFor="ticker-active" className="text-sm font-medium">Mostrar en la tienda</label>
                <Switch id="ticker-active" checked={form.activo} onCheckedChange={(activo) => setForm({ ...form, activo })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="h-11" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="h-11" disabled={saving} onClick={() => void saveMessage()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear mensaje'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
