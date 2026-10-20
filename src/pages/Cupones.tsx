import { useCallback, useEffect, useState } from 'react';
import { BadgePercent, Check, Loader2, Pencil, Plus, Power, RefreshCw, TicketPercent, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  createColaborador,
  createCupon,
  getColaboradores,
  getCupones,
  getUsosCupon,
  setColaboradorActivo,
  setCuponActivo,
  updateColaborador,
  updateCupon,
} from '@/integrations/api';

type Tab = 'cupones' | 'colaboradores';
type Coupon = Record<string, any> & { id: number; codigo: string; descuento_porcentaje: number; activo: boolean };
type Collaborator = Record<string, any> & { id: number; nombre: string; tipo: string; activo: boolean };

const emptyCoupon = {
  codigo: '',
  descuento_porcentaje: '',
  colaborador_id: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  uso_maximo: '',
  es_global: false,
  activo: true,
};

const emptyCollaborator = {
  nombre: '',
  telefono: '',
  email: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  tipo: 'influencer',
  usuario_id: '',
  observaciones: '',
  activo: true,
};

function unwrap<T>(response: any): T[] {
  if (Array.isArray(response)) return response as T[];
  if (Array.isArray(response?.data)) return response.data as T[];
  return [];
}

function dateInputValue(value?: string | null) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block min-w-0 space-y-1.5 ${className}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function Cupones() {
  const [tab, setTab] = useState<Tab>('cupones');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [couponForm, setCouponForm] = useState<any>(emptyCoupon);
  const [collaboratorForm, setCollaboratorForm] = useState<any>(emptyCollaborator);
  const [editingCouponId, setEditingCouponId] = useState<number | null>(null);
  const [editingCollaboratorId, setEditingCollaboratorId] = useState<number | null>(null);
  const [expandedCouponId, setExpandedCouponId] = useState<number | null>(null);
  const [couponUses, setCouponUses] = useState<Record<number, any[]>>({});
  const [loadingUsesId, setLoadingUsesId] = useState<number | null>(null);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [couponsResponse, collaboratorsResponse] = await Promise.all([getCupones(), getColaboradores()]);
      setCoupons(unwrap<Coupon>(couponsResponse));
      setCollaborators(unwrap<Collaborator>(collaboratorsResponse));
    } catch (error: any) {
      toast.error(error?.message || 'No se pudieron cargar los cupones');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetCouponForm = () => {
    setCouponForm(emptyCoupon);
    setEditingCouponId(null);
  };

  const resetCollaboratorForm = () => {
    setCollaboratorForm(emptyCollaborator);
    setEditingCollaboratorId(null);
  };

  const saveCoupon = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...couponForm,
      codigo: String(couponForm.codigo).trim().toUpperCase(),
      descuento_porcentaje: Number(couponForm.descuento_porcentaje),
      colaborador_id: couponForm.colaborador_id || null,
      uso_maximo: couponForm.uso_maximo || null,
      fecha_inicio: couponForm.fecha_inicio || null,
      fecha_fin: couponForm.fecha_fin || null,
    };
    try {
      if (editingCouponId) {
        await updateCupon(editingCouponId, payload);
        toast.success('Cupón actualizado');
      } else {
        await createCupon(payload);
        toast.success('Cupón creado');
      }
      resetCouponForm();
      await loadData(false);
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo guardar el cupón');
    } finally {
      setSaving(false);
    }
  };

  const saveCollaborator = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...collaboratorForm,
      nombre: String(collaboratorForm.nombre).trim(),
      usuario_id: collaboratorForm.usuario_id || null,
    };
    try {
      if (editingCollaboratorId) {
        await updateColaborador(editingCollaboratorId, payload);
        toast.success('Colaborador actualizado');
      } else {
        await createColaborador(payload);
        toast.success('Colaborador creado');
      }
      resetCollaboratorForm();
      await loadData(false);
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo guardar el colaborador');
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon: Coupon) => {
    try {
      await setCuponActivo(coupon.id, !coupon.activo);
      await loadData(false);
      toast.success(coupon.activo ? 'Cupón desactivado' : 'Cupón activado');
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo cambiar el estado del cupón');
    }
  };

  const toggleCollaborator = async (collaborator: Collaborator) => {
    try {
      await setColaboradorActivo(collaborator.id, !collaborator.activo);
      await loadData(false);
      toast.success(collaborator.activo ? 'Colaborador desactivado' : 'Colaborador activado');
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo cambiar el estado del colaborador');
    }
  };

  const toggleUses = async (couponId: number) => {
    if (expandedCouponId === couponId) {
      setExpandedCouponId(null);
      return;
    }
    setExpandedCouponId(couponId);
    if (couponUses[couponId]) return;
    setLoadingUsesId(couponId);
    try {
      const response = await getUsosCupon(couponId);
      setCouponUses((current) => ({ ...current, [couponId]: unwrap(response) }));
    } catch (error: any) {
      toast.error(error?.message || 'No se pudo cargar el historial de uso');
    } finally {
      setLoadingUsesId(null);
    }
  };

  const beginEditCoupon = (coupon: Coupon) => {
    setTab('cupones');
    setEditingCouponId(coupon.id);
    setCouponForm({
      codigo: coupon.codigo,
      descuento_porcentaje: String(coupon.descuento_porcentaje),
      colaborador_id: coupon.colaborador_id == null ? '' : String(coupon.colaborador_id),
      descripcion: coupon.descripcion || '',
      fecha_inicio: dateInputValue(coupon.fecha_inicio),
      fecha_fin: dateInputValue(coupon.fecha_fin),
      uso_maximo: coupon.uso_maximo == null ? '' : String(coupon.uso_maximo),
      es_global: Boolean(coupon.es_global),
      activo: Boolean(coupon.activo),
    });
  };

  const beginEditCollaborator = (collaborator: Collaborator) => {
    setTab('colaboradores');
    setEditingCollaboratorId(collaborator.id);
    setCollaboratorForm({
      nombre: collaborator.nombre || '',
      telefono: collaborator.telefono || '',
      email: collaborator.email || '',
      instagram: collaborator.instagram || '',
      tiktok: collaborator.tiktok || '',
      youtube: collaborator.youtube || '',
      tipo: collaborator.tipo,
      usuario_id: collaborator.usuario_id == null ? '' : String(collaborator.usuario_id),
      observaciones: collaborator.observaciones || '',
      activo: Boolean(collaborator.activo),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <TicketPercent className="h-6 w-6 text-primary" /> Cupones y colaboradores
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Administra códigos promocionales y sus colaboradores asociados.</p>
          </div>
          <Button variant="outline" onClick={() => void loadData()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Actualizar
          </Button>
        </header>

        <div className="flex w-full gap-1 border-b sm:w-fit">
          <button type="button" onClick={() => setTab('cupones')} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium ${tab === 'cupones' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <BadgePercent className="h-4 w-4" /> Cupones <span className="tabular-nums">{coupons.length}</span>
          </button>
          <button type="button" onClick={() => setTab('colaboradores')} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium ${tab === 'colaboradores' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <Users className="h-4 w-4" /> Colaboradores <span className="tabular-nums">{collaborators.length}</span>
          </button>
        </div>

        {tab === 'cupones' ? (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
            <Card>
              <CardHeader><CardTitle>{editingCouponId ? 'Editar cupón' : 'Crear cupón'}</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={saveCoupon}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Código">
                      <input required maxLength={40} className={`${inputClass} uppercase`} value={couponForm.codigo} onChange={(e) => setCouponForm({ ...couponForm, codigo: e.target.value.toUpperCase() })} placeholder="MIRRA10" />
                    </Field>
                    <Field label="Descuento (%)">
                      <input required type="number" min="0.01" max="100" step="0.01" className={inputClass} value={couponForm.descuento_porcentaje} onChange={(e) => setCouponForm({ ...couponForm, descuento_porcentaje: e.target.value })} placeholder="10" />
                    </Field>
                  </div>
                  <Field label="Colaborador asociado">
                    <select className={inputClass} value={couponForm.colaborador_id} onChange={(e) => setCouponForm({ ...couponForm, colaborador_id: e.target.value })}>
                      <option value="">Sin colaborador</option>
                      {collaborators.filter((item) => item.activo).map((item) => <option key={item.id} value={item.id}>{item.nombre} · {item.tipo}</option>)}
                    </select>
                  </Field>
                  <Field label="Descripción">
                    <textarea rows={2} className={inputClass} value={couponForm.descripcion} onChange={(e) => setCouponForm({ ...couponForm, descripcion: e.target.value })} placeholder="Motivo o campaña del cupón" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Fecha de inicio">
                      <input type="date" className={inputClass} value={couponForm.fecha_inicio} onChange={(e) => setCouponForm({ ...couponForm, fecha_inicio: e.target.value })} />
                    </Field>
                    <Field label="Fecha de fin">
                      <input type="date" min={couponForm.fecha_inicio || undefined} className={inputClass} value={couponForm.fecha_fin} onChange={(e) => setCouponForm({ ...couponForm, fecha_fin: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Máximo de usos">
                    <input type="number" min="1" step="1" className={inputClass} value={couponForm.uso_maximo} onChange={(e) => setCouponForm({ ...couponForm, uso_maximo: e.target.value })} placeholder="Ilimitado" />
                  </Field>
                  <label className="flex min-h-11 items-center gap-3 rounded-md border px-3">
                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={couponForm.es_global} onChange={(e) => setCouponForm({ ...couponForm, es_global: e.target.checked })} />
                    <span className="text-sm">Cupón global, válido para cualquier cliente</span>
                  </label>
                  <label className="flex min-h-11 items-center gap-3 rounded-md border px-3">
                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={couponForm.activo} onChange={(e) => setCouponForm({ ...couponForm, activo: e.target.checked })} />
                    <span className="text-sm">Cupón activo</span>
                  </label>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    {editingCouponId && <Button type="button" variant="outline" onClick={resetCouponForm}>Cancelar edición</Button>}
                    <Button type="submit" disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingCouponId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {editingCouponId ? 'Guardar cambios' : 'Crear cupón'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <section className="space-y-3" aria-label="Lista de cupones">
              {loading ? <Card><CardContent className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando cupones...</CardContent></Card> : coupons.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Todavía no hay cupones creados.</CardContent></Card>
              ) : coupons.map((coupon) => (
                <Card key={coupon.id} className={!coupon.activo ? 'opacity-70' : ''}>
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="break-all rounded bg-muted px-2 py-1 text-sm font-bold tracking-wide">{coupon.codigo}</code>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${coupon.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>{coupon.activo ? 'Activo' : 'Inactivo'}</span>
                          {coupon.es_global && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">Global</span>}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{coupon.descripcion || coupon.colaborador_nombre || 'Sin descripción'}</p>
                      </div>
                      <strong className="shrink-0 text-2xl tabular-nums">{Number(coupon.descuento_porcentaje).toLocaleString('es-VE')}%</strong>
                    </div>
                    <div className="grid gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>Colaborador: {coupon.colaborador_nombre || 'General'}</span>
                      <span>Usos: {coupon.uso_actual ?? coupon.usos_registrados ?? 0}{coupon.uso_maximo ? ` / ${coupon.uso_maximo}` : ' / ilimitados'}</span>
                      <span>Desde: {coupon.fecha_inicio ? new Date(coupon.fecha_inicio).toLocaleDateString() : 'Inmediato'}</span>
                      <span>Hasta: {coupon.fecha_fin ? new Date(coupon.fecha_fin).toLocaleDateString() : 'Sin vencimiento'}</span>
                      {Number(coupon.descuento_total || 0) > 0 && (
                        <span className="font-medium text-amber-700 sm:col-span-2">
                          Total descontado: ${Number(coupon.descuento_total || 0).toFixed(2)} en {coupon.usos_registrados ?? coupon.uso_actual ?? 0} {Number(coupon.usos_registrados ?? coupon.uso_actual ?? 0) === 1 ? 'pedido' : 'pedidos'}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 border-t pt-3">
                      <Button size="sm" variant="outline" onClick={() => beginEditCoupon(coupon)}><Pencil className="mr-2 h-3.5 w-3.5" /> Editar</Button>
                      <Button size="sm" variant="outline" onClick={() => void toggleCoupon(coupon)}><Power className="mr-2 h-3.5 w-3.5" /> {coupon.activo ? 'Desactivar' : 'Activar'}</Button>
                      <Button size="sm" variant="ghost" onClick={() => void toggleUses(coupon.id)}>{expandedCouponId === coupon.id ? 'Ocultar usos' : 'Ver usos'}</Button>
                    </div>
                    {expandedCouponId === coupon.id && (
                      <div className="space-y-2 border-t pt-3">
                        <p className="text-sm font-medium">Historial de uso</p>
                        {loadingUsesId === coupon.id ? <p className="text-xs text-muted-foreground">Cargando...</p> : (couponUses[coupon.id] || []).length === 0 ? <p className="text-xs text-muted-foreground">Aún no hay usos registrados.</p> : couponUses[coupon.id].map((usage: any) => (
                          <div key={usage.id} className="flex flex-wrap justify-between gap-2 rounded border px-3 py-2 text-xs">
                            <span>Pedido #{usage.pedido_venta_id}{usage.nombre_cliente ? ` · ${usage.nombre_cliente}` : ''}</span>
                            <span>{Number(usage.descuento_aplicado).toFixed(2)} · {new Date(usage.usado_en).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        ) : (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
            <Card>
              <CardHeader><CardTitle>{editingCollaboratorId ? 'Editar colaborador' : 'Agregar colaborador'}</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={saveCollaborator}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nombre">
                      <input required className={inputClass} value={collaboratorForm.nombre} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, nombre: e.target.value })} />
                    </Field>
                    <Field label="Tipo">
                      <select className={inputClass} value={collaboratorForm.tipo} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, tipo: e.target.value })}>
                        <option value="trabajador">Trabajador</option>
                        <option value="influencer">Influencer</option>
                        <option value="colaborador">Colaborador</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Teléfono">
                      <input type="tel" className={inputClass} value={collaboratorForm.telefono} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, telefono: e.target.value })} />
                    </Field>
                    <Field label="Correo electrónico">
                      <input type="email" className={inputClass} value={collaboratorForm.email} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, email: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Instagram">
                      <input className={inputClass} value={collaboratorForm.instagram} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, instagram: e.target.value })} placeholder="@usuario o URL" />
                    </Field>
                    <Field label="TikTok">
                      <input className={inputClass} value={collaboratorForm.tiktok} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, tiktok: e.target.value })} placeholder="@usuario o URL" />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="YouTube">
                      <input className={inputClass} value={collaboratorForm.youtube} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, youtube: e.target.value })} placeholder="Canal o URL" />
                    </Field>
                    <Field label="ID de usuario (opcional)">
                      <input type="number" min="1" className={inputClass} value={collaboratorForm.usuario_id} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, usuario_id: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Observaciones">
                    <textarea rows={3} className={inputClass} value={collaboratorForm.observaciones} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, observaciones: e.target.value })} />
                  </Field>
                  <label className="flex min-h-11 items-center gap-3 rounded-md border px-3">
                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={collaboratorForm.activo} onChange={(e) => setCollaboratorForm({ ...collaboratorForm, activo: e.target.checked })} />
                    <span className="text-sm">Colaborador activo</span>
                  </label>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    {editingCollaboratorId && <Button type="button" variant="outline" onClick={resetCollaboratorForm}>Cancelar edición</Button>}
                    <Button type="submit" disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingCollaboratorId ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {editingCollaboratorId ? 'Guardar cambios' : 'Crear colaborador'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <section className="space-y-3" aria-label="Lista de colaboradores">
              {loading ? <Card><CardContent className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando colaboradores...</CardContent></Card> : collaborators.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Todavía no hay colaboradores registrados.</CardContent></Card>
              ) : collaborators.map((collaborator) => (
                <Card key={collaborator.id} className={!collaborator.activo ? 'opacity-70' : ''}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{collaborator.nombre}</h3>
                        <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">{collaborator.tipo}</span>
                        <span className={`rounded-full px-2 py-1 text-xs ${collaborator.activo ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>{collaborator.activo ? 'Activo' : 'Inactivo'}</span>
                      </div>
                      <p className="break-words text-sm text-muted-foreground">{[collaborator.telefono, collaborator.email].filter(Boolean).join(' · ') || 'Sin datos de contacto'}</p>
                      <p className="break-words text-xs text-muted-foreground">{[
                        collaborator.instagram && `Instagram: ${collaborator.instagram}`,
                        collaborator.tiktok && `TikTok: ${collaborator.tiktok}`,
                        collaborator.youtube && `YouTube: ${collaborator.youtube}`,
                      ].filter(Boolean).join(' · ')}</p>
                      {collaborator.observaciones && <p className="text-xs text-muted-foreground">{collaborator.observaciones}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2 border-t pt-3 sm:border-0 sm:pt-0">
                      <Button size="sm" variant="outline" onClick={() => beginEditCollaborator(collaborator)}><Pencil className="mr-2 h-3.5 w-3.5" /> Editar</Button>
                      <Button size="sm" variant="outline" onClick={() => void toggleCollaborator(collaborator)}><Power className="mr-2 h-3.5 w-3.5" />{collaborator.activo ? 'Desactivar' : 'Activar'}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
}