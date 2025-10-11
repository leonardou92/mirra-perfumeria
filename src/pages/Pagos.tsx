import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

export default function Pagos() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pagos</h2>
          <p className="text-muted-foreground">Gestión de pagos y transacciones</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El módulo de gestión de pagos estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
