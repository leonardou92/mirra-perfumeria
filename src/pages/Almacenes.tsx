import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function Almacenes() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Almacenes</h2>
          <p className="text-muted-foreground">Gestión de almacenes e inventario</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El módulo de gestión de almacenes estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
