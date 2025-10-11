import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockProducts = [
  { id: 1, nombre: "Eau de Parfum Clásico", codigo: "EDP001", categoria: "Perfumes", stock: 45, precio: 89.99, estado: "Activo" },
  { id: 2, nombre: "Fragancia Floral", codigo: "FF002", categoria: "Fragancias", stock: 23, precio: 69.99, estado: "Activo" },
  { id: 3, nombre: "Colonia Fresca", codigo: "CF003", categoria: "Colonias", stock: 78, precio: 49.99, estado: "Activo" },
  { id: 4, nombre: "Perfume de Noche", codigo: "PN004", categoria: "Perfumes", stock: 12, precio: 129.99, estado: "Bajo Stock" },
  { id: 5, nombre: "Esencia Natural", codigo: "EN005", categoria: "Esencias", stock: 156, precio: 39.99, estado: "Activo" },
];

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
            <p className="text-muted-foreground">Gestión completa del catálogo de productos</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Listado de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-smooth">
                    <TableCell className="font-mono text-sm">{product.codigo}</TableCell>
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell>{product.categoria}</TableCell>
                    <TableCell>
                      <span className={product.stock < 20 ? "text-destructive font-semibold" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>${product.precio}</TableCell>
                    <TableCell>
                      <Badge variant={product.estado === "Activo" ? "default" : "destructive"}>
                        {product.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
