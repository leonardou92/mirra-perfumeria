import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function Pedidos() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
          <p className="text-muted-foreground">Gestión de pedidos de compra y venta</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El módulo de gestión de pedidos estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
