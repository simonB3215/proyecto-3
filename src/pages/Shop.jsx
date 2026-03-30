import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Filter, Loader2, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';

const placeholderImages = {
  'Electrónica': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop',
  'Ropa': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?w=500&h=500&fit=crop',
  'Poleras': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'Polerones': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
  'Pantalones': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
  'Calzado': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
  'Hogar': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop',
  'Deportes': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=500&fit=crop'
};

const Shop = () => {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id, nombre, descripcion, precio, imagen_url, estado, stock,
          categorias ( nombre )
        `)
        .eq('estado', 'activo');

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url, categoryName) => {
    if (!url || url.length < 5 || url.startsWith('img/')) {
      return placeholderImages[categoryName] || placeholderImages['Default'];
    }
    return url;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToast(product.id);
    setTimeout(() => setAddedToast(null), 2000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg">Catálogo <span className="text-gradient-gold">Dorado</span></h1>
        
        <div className="flex gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '10px', left: '12px' }} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                outline: 'none',
                width: '100%',
                maxWidth: '300px'
              }}
            />
          </div>
          <button className="btn btn-outline" style={{ padding: '0.6rem 1rem' }}>
            <Filter size={20} /> Filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
          <Loader2 size={48} color="var(--gold-main)" className="animate-spin" />
          <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Cargando inventario...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center flex-col items-center" style={{ minHeight: '400px', color: 'var(--text-secondary)' }}>
          <p>No se encontraron productos disponibles.</p>
        </div>
      ) : (
        <div className="grid gap-6" style={{ 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          marginBottom: '4rem' 
        }}>
          {products.map(product => {
            const catName = product.categorias?.nombre || 'General';
            return (
              <div 
                key={product.id} 
                className="card" 
                style={{ padding: '0', overflow: 'hidden', position: 'relative' }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={getImageUrl(product.imagen_url, catName)} 
                    alt={product.nombre} 
                    style={{
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform var(--transition-normal)',
                      transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(10, 10, 10, 0.6)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    backdropFilter: 'blur(4px)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    Stock: {product.stock}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(10, 10, 10, 0.4)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      color: isFavorite(product.id) ? 'var(--gold-main)' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Heart size={18} fill={isFavorite(product.id) ? 'var(--gold-main)' : 'none'} color={isFavorite(product.id) ? 'var(--gold-main)' : 'white'} />
                  </button>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-main)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {catName}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.nombre}
                  </h3>
                  <div className="flex justify-between items-center" style={{ marginTop: '1.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(product.precio).toLocaleString()}</span>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedToast === product.id ? (
                        <><Check size={18} /> Añadido</>
                      ) : (
                        <><ShoppingCart size={18} /> {product.stock > 0 ? 'Añadir' : 'Agotado'}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Shop;

