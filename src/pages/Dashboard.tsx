import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users, Warehouse, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const statsData = [
  { title: "Total Productos", value: "1,234", icon: Package, trend: "+12%", color: "text-primary" },
  { title: "Pedidos Activos", value: "45", icon: ShoppingCart, trend: "+8%", color: "text-accent" },
  { title: "Almacenes", value: "8", icon: Warehouse, trend: "+2", color: "text-chart-3" },
  { title: "Ventas del Mes", value: "$45,231", icon: DollarSign, trend: "+23%", color: "text-chart-4" },
];

const salesData = [
  { name: "Ene", ventas: 4000, compras: 2400 },
  { name: "Feb", ventas: 3000, compras: 1398 },
  { name: "Mar", ventas: 2000, compras: 9800 },
  { name: "Abr", ventas: 2780, compras: 3908 },
  { name: "May", ventas: 1890, compras: 4800 },
  { name: "Jun", ventas: 2390, compras: 3800 },
];

const topProducts = [
  { name: "Eau de Parfum Clásico", sales: 234, revenue: "$12,345" },
  { name: "Fragancia Floral", sales: 189, revenue: "$9,876" },
  { name: "Colonia Fresca", sales: 156, revenue: "$7,543" },
  { name: "Perfume de Noche", sales: 143, revenue: "$6,789" },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Resumen general del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <Card key={stat.title} className="transition-smooth hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">{stat.trend}</span> vs mes anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ventas y Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventas" fill="hsl(var(--primary))" />
                  <Bar dataKey="compras" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ventas" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
