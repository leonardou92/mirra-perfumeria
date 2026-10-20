import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Product } from '@/lib/types';
import { getCatalogoPaginated } from '@/integrations/api';
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

interface ProductCarouselProps {
  products?: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products: providedProducts }) => {
  const { addItem } = useCart();
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(providedProducts === undefined);

  useEffect(() => {
    if (providedProducts !== undefined) return;

    let mounted = true;
    setLoading(true);
    getCatalogoPaginated()
      .then((response) => {
        const items = Array.isArray(response) ? response : (response?.items ?? response?.data ?? []);
        const catalogProducts: Product[] = (Array.isArray(items) ? items : []).map((item: Record<string, unknown>) => {
          const brand = typeof item.marca === 'object' && item.marca !== null
            ? item.marca as Record<string, unknown>
            : {};
          const category = typeof item.categoria === 'object' && item.categoria !== null
            ? item.categoria as Record<string, unknown>
            : {};
          const brandName = brand.nombre ?? brand.name ?? item.marca_nombre ?? item.marca ?? item.brand ?? '';
          const categoryName = category.nombre ?? category.name ?? item.categoria_nombre ?? item.categoria ?? item.category ?? '';

          return {
            id: Number(item.id ?? item.producto_id ?? 0),
            name: String(item.nombre ?? item.name ?? ''),
            image_url: (item.image_url ?? item.imagen ?? item.image ?? undefined) as string | undefined,
            featured: Boolean(item.destacado ?? item.featured ?? false),
            brand: String(brandName),
            category: String(categoryName),
            description: String(item.descripcion ?? item.description ?? ''),
            price: Number(item.precio_venta ?? item.price ?? 0) || 0,
            precio_venta: (item.precio_venta ?? null) as number | null,
            tamanos: (Array.isArray(item.tamanos)
              ? item.tamanos
              : Array.isArray(item.formulas)
                ? item.formulas
                : []) as Product['tamanos'],
            stock: Number(item.stock ?? item.stock_disponible ?? 0) || 0,
          };
        });
        if (mounted) setFetchedProducts(catalogProducts);
      })
      .catch((error: unknown) => {
        console.error('Error cargando productos destacados:', error);
        toast.error('No se pudieron cargar los productos destacados');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [providedProducts]);

  const sourceProducts = providedProducts ?? fetchedProducts;
  const featuredProducts = sourceProducts.filter((product) => product.featured);

  if (loading || featuredProducts.length === 0) return null;

  const settings = {
    dots: featuredProducts.length > 1,
    infinite: featuredProducts.length > 4,
    speed: 600,
    slidesToShow: Math.min(4, featuredProducts.length),
    slidesToScroll: 1,
    autoplay: featuredProducts.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, featuredProducts.length),
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, featuredProducts.length),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <section className="w-full bg-gradient-to-br from-cream-50 via-white to-cream-100 py-10 md:py-16" aria-label="Productos destacados">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Selección especial</span>
          <h2 className="mt-2 font-playfair text-3xl font-bold text-copper-900 md:text-4xl">Productos destacados</h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-copper-600" />
        </div>

        <Slider {...settings} className="featured-carousel -mx-1 pb-8 sm:-mx-2">
          {featuredProducts.map((product) => (
            <div key={product.id} className="h-full px-2 pb-4 sm:px-3 sm:pb-3">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                openModalOnAdd
                showStock={false}
                featuredLayout
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProductCarousel;
