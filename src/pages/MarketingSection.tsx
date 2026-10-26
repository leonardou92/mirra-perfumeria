import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Star, TicketPercent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MarketingSectionProps {
  title: 'Destacados' | 'Cupones';
}

const sectionDetails = {
  Destacados: {
    icon: Star,
    description: 'Administra los productos destacados que se muestran en la tienda.',
  },
  Cupones: {
    icon: TicketPercent,
    description: 'Crea y administra los cupones de descuento de la tienda.',
  },
};

export default function MarketingSection({ title }: MarketingSectionProps) {
  const { icon: Icon, description } = sectionDetails[title];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Icon className="h-6 w-6 text-primary" />
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardContent className="px-6 py-16 text-center">
            <Icon className="mx-auto h-8 w-8 text-muted-foreground/50" />
            {title === 'Destacados' ? (
              <>
                <p className="mt-3 font-medium">Elige qué productos destacar</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Edita un producto y activa “Mostrar en productos destacados” para incluirlo en el carrusel de la tienda.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/productos">Ir a productos</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="mt-3 font-medium">Sección lista para configurar</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aquí podrás gestionar cupones.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
