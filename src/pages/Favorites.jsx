import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
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

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite, addToCart } = useShop();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }
    fetchFavorites();
  }, [favorites]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id, nombre, descripcion, precio, imagen_url, estado, stock,
          categorias ( nombre )
        `)
        .in('id', favorites);

      if (error) throw error;
      setFavoriteProducts(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
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

  if (favorites.length === 0 && !loading) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '2rem' }}>
          <Heart size={80} color="var(--gold-main)" opacity={0.5} />
        </div>
        <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Tus Favoritos</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          No tienes ningún producto en tu lista de deseos. Explora la tienda y dales al corazón para guardarlos aquí.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          Explorar la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Tus <span className="text-gradient-gold">Favoritos</span></h1>

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
          <Loader2 size={48} color="var(--gold-main)" className="animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {favoriteProducts.map((product) => {
            const catName = product.categorias?.nombre || 'General';
            return (
              <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={getImageUrl(product.imagen_url, catName)} 
                    alt={product.nombre} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFallbackImage(catName);
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(10, 10, 10, 0.6)',
                    padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem',
                    backdropFilter: 'blur(4px)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)'
                  }}>
                    Stock: {product.stock}
                  </div>
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    style={{
                      position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(10, 10, 10, 0.4)',
                      border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      backdropFilter: 'blur(4px)', color: 'var(--gold-main)'
                    }}
                  >
                    <Heart size={18} fill="var(--gold-main)" />
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
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-main)', borderColor: 'var(--gold-main)', background: 'transparent' }} 
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart size={18} /> {product.stock > 0 ? 'Mover al carrito' : 'Agotado'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Favorites;
