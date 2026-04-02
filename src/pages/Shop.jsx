import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Heart, Search, Filter, Loader2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';

const placeholderImages = {
  'electrónica': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop',
  'ropa': 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?w=500&h=500&fit=crop',
  'poleras': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'polera': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'polerones': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
  'polerón': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
  'pantalones': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
  'pantalon': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
  'calzado': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
  'hogar': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&h=500&fit=crop',
  'deportes': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop',
  'default': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=500&fit=crop'
};

const getFallbackImage = (categoryName) => {
  const normalized = (categoryName || '').trim().toLowerCase();
  return placeholderImages[normalized] || placeholderImages['default'];
};

const Shop = () => {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct]);

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
    if (!url || typeof url !== 'string' || url.trim() === '' || url.length < 5 || url.startsWith('img/')) {
      return getFallbackImage(categoryName);
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
      <div className="flex flex-col-mobile shop-header gap-mobile-4 justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ alignSelf: 'flex-start' }}>Catálogo <span className="text-gradient-gold">Dorado</span></h1>
        
        <div className="flex gap-4 w-full-mobile">
          <div style={{ position: 'relative', flex: 1 }}>
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
                maxWidth: '400px'
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          marginBottom: '4rem' 
        }}>
          {products.map(product => {
            const catName = product.categorias?.nombre || 'General';
            return (
              <div 
                key={product.id} 
                className="card product-card" 
                style={{ padding: '0', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => setSelectedProduct(product)}
              >
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={getImageUrl(product.imagen_url, catName)} 
                    alt={product.nombre} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(catName);
                    }}
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
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-main)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {catName}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0.5rem 0 0.25rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.nombre}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4',
                    flex: 1
                  }}>
                    {product.descripcion || 'Sin descripción disponible para este producto exclusivo.'}
                  </p>
                  <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(product.precio).toLocaleString()}</span>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 2 }} 
                      disabled={product.stock === 0}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
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
      
      {/* MODAL DEL PRODUCTO COMPLETO */}
      {selectedProduct && createPortal((() => {
        const catName = selectedProduct.categorias?.nombre || 'General';
        return (
          <div 
            className="animate-fade-in"
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(16px)',
              padding: '1rem'
            }}
            onClick={() => setSelectedProduct(null)}
          >
            <div 
              className="product-modal-content"
              style={{
                background: 'var(--bg-primary)',
                borderRadius: '16px',
                border: '1px solid var(--border-gold)',
                width: '100%', maxWidth: '900px',
                display: 'flex',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(234, 179, 8, 0.1)',
                overflow: 'hidden',
                position: 'relative',
                maxHeight: '90vh'
              }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="btn-ghost"
                style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', borderRadius: '50%', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              {/* Imagen del lado izquierdo (o arriba en mobile) */}
              <div className="product-modal-image" style={{ flex: '1 1 50%', minHeight: '350px', position: 'relative', background: '#000' }}>
                 <img 
                    src={getImageUrl(selectedProduct.imagen_url, catName)} 
                    alt={selectedProduct.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(catName);
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  />
              </div>

              {/* Contenido derecho (o abajo en mobile) */}
              <div style={{ flex: '1 1 50%', padding: '2.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gold-main)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {catName}
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {selectedProduct.nombre}
                </h2>
                <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'white' }}>
                  ${Number(selectedProduct.precio).toLocaleString()}
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Descripción Completa</h4>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '1rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedProduct.descripcion || 'Sin descripción disponible para este producto exclusivo.'}
                  </p>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '1rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.75rem', flex: 1, minWidth: '200px' }} 
                      disabled={selectedProduct.stock === 0}
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      {addedToast === selectedProduct.id ? (
                        <><Check size={20} /> Añadido</>
                      ) : (
                        <><ShoppingCart size={20} /> {selectedProduct.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}</>
                      )}
                    </button>
                    <button 
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="btn btn-outline"
                      style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', borderRadius: '12px', background: isFavorite(selectedProduct.id) ? 'rgba(234, 179, 8, 0.1)' : 'transparent', borderColor: isFavorite(selectedProduct.id) ? 'var(--gold-main)' : 'var(--border-subtle)' }}
                    >
                      <Heart size={24} fill={isFavorite(selectedProduct.id) ? 'var(--gold-main)' : 'none'} color={isFavorite(selectedProduct.id) ? 'var(--gold-main)' : 'white'} />
                    </button>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: selectedProduct.stock <= 5 ? '#ef4444' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: selectedProduct.stock > 0 ? (selectedProduct.stock <= 5 ? '#ef4444' : '#10b981') : 'var(--text-secondary)' }}></span>
                  {selectedProduct.stock > 0 ? `Stock disponible: ${selectedProduct.stock} unidades` : 'No hay stock disponible en este momento'}
                </div>

              </div>
            </div>
          </div>
        );
      })(), document.body)}
      
      <style>{`
        @media (max-width: 768px) {
          .shop-header { align-items: stretch !important; }
          .w-full-mobile { width: 100%; flex-wrap: wrap; }
          .w-full-mobile input { max-width: 100% !important; }
        }
        
        .product-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          border: 1px solid var(--border-subtle);
          background: rgba(10, 10, 10, 0.4);
        }
        .product-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(234, 179, 8, 0.15);
          border-color: rgba(234, 179, 8, 0.3);
          z-index: 10;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
           .product-modal-content {
             flex-direction: column !important;
             max-height: 90vh;
             overflow-y: auto !important;
             border-radius: 12px !important;
           }
           .product-modal-image {
             flex: none !important;
             height: 250px !important;
             min-height: 250px !important;
             width: 100% !important;
             position: relative !important;
             display: block !important;
           }
        }
      `}</style>
    </div>
  );
};

export default Shop;

