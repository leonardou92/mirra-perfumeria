import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { getAlmacenes, createAlmacen, updateAlmacen, deleteAlmacen } from "@/integrations/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, Warehouse } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function Almacenes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [almacenes, setAlmacenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      nombre: "",
      tipo: "MateriaPrima",
      ubicacion: "",
      responsable: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    getAlmacenes()
      .then((data) => setAlmacenes(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error al cargar almacenes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = almacenes.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.nombre || "").toLowerCase().includes(term) ||
      (p.ubicacion || "").toLowerCase().includes(term) ||
      (p.responsable || "").toLowerCase().includes(term)
    );
  });

  async function onSubmit(values: any) {
    try {
      const tipo = (values.tipo || "").toString();
      // Validación cliente: asegurar que tipo esté en las opciones permitidas
      if (!['MateriaPrima', 'Venta'].includes(tipo)) {
        toast.error('Tipo inválido (selecciona una opción válida)');
        return;
      }

      const payload = {
        nombre: (values.nombre || "").toString(),
        tipo,
        ubicacion: (values.ubicacion || "").toString(),
        responsable: (values.responsable || "").toString(),
      };

      console.log('Almacenes payload:', payload);

      if (editing) {
        const updated = await updateAlmacen(editing.id, payload);
        setAlmacenes((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
        toast.success('Almacén actualizado');
        setEditing(null);
      } else {
        const created = await createAlmacen(payload);
        setAlmacenes((prev) => [created, ...prev]);
        toast.success('Almacén creado');
      }

      form.reset();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      let message = 'Error al guardar almacén';
      try {
        if (err instanceof Error) {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.error) message = parsed.error;
          else if (parsed && parsed.message) message = parsed.message;
        }
      } catch (e) {
        // noop
      }
      toast.error(message);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Almacenes</h2>
            <p className="text-muted-foreground">Gestión de almacenes</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Almacén
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Editar Almacén" : "Nuevo Almacén"}</DialogTitle>
                <DialogDescription>Rellena los datos del almacén</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...form.register("nombre", { required: true })} />
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm"
                        {...form.register("tipo", { required: true })}
                      >
                        <option value="MateriaPrima">MateriaPrima</option>
                        <option value="Venta">Venta</option>
                      </select>
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <Input {...form.register("ubicacion")} />
                    </FormControl>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                      <Input {...form.register("responsable")} />
                    </FormControl>
                  </FormItem>

                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => { setIsOpen(false); setEditing(null); form.reset(); }}>Cancelar</Button>
                    <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Listado de Almacenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="pt-2 pb-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por nombre, ubicación o responsable..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>

            {loading ? (
              <div>Cargando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p: any) => (
                    <TableRow key={p.id} className="hover:bg-muted/50 transition-smooth">
                      <TableCell className="font-mono text-sm">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.nombre}</TableCell>
                      <TableCell>{p.ubicacion ?? "-"}</TableCell>
                      <TableCell>{p.responsable ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditing(p);
                            form.reset({ nombre: p.nombre, tipo: p.tipo ?? 'MateriaPrima', ubicacion: p.ubicacion, responsable: p.responsable });
                            setIsOpen(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeleteTarget(p); setAlertOpen(true); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
              <AlertDialogDescription>¿Eliminar almacén {deleteTarget?.nombre}? Esta acción no se puede deshacer.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={async () => {
                if (!deleteTarget) return;
                try {
                  await deleteAlmacen(deleteTarget.id);
                  setAlmacenes((prev) => prev.filter((x) => x.id !== deleteTarget.id));
                  toast.success("Almacén eliminado");
                } catch (err) {
                  console.error(err);
                  toast.error("Error al eliminar almacén");
                } finally {
                  setDeleteTarget(null);
                  setAlertOpen(false);
                }
              }}>Eliminar</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
