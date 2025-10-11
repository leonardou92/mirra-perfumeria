import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function Contactos() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contactos</h2>
          <p className="text-muted-foreground">Gestión de clientes y contactos</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El módulo de gestión de contactos estará disponible próximamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
