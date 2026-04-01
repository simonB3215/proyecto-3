import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useShop();

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.precio) * item.quantity), 0);
  const envio = subtotal > 0 && subtotal < 50000 ? 3000 : 0; // Envío gratis sobre 50,000
  const total = subtotal + envio;

  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '2rem' }}>
          <ShoppingBag size={80} color="var(--gold-main)" opacity={0.5} />
        </div>
        <h2 className="heading-md" style={{ marginBottom: '1rem' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          Parece que aún no has agregado nada al carrito. Descubre nuestras colecciones y encuentra lo mejor para ti.
        </p>
        <Link to="/shop" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          Explorar la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Tu <span className="text-gradient-gold">Carrito</span></h1>
      
      <div className="grid gap-8 cart-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', alignItems: 'start' }}>
        {/* Lado izquierdo: Lista de productos */}
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 cart-item" style={{ padding: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', overflow: 'hidden', flexShrink: 0 }}>
                <img 
                  src={item.imagen_url && !item.imagen_url.startsWith('img/') ? item.imagen_url : 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?w=200&h=200&fit=crop'} 
                  alt={item.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-main)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {item.categorias?.nombre || 'Producto'}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: '0.2rem 0' }}>{item.nombre}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  ${Number(item.precio).toLocaleString()} c/u
                </div>
              </div>

              <div className="flex items-center gap-2" style={{ background: 'var(--bg-primary)', padding: '0.2rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: '20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.4rem' }}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 600, width: '90px', textAlign: 'right' }}>
                ${(Number(item.precio) * item.quantity).toLocaleString()}
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--error-color, #ef4444)', cursor: 'pointer', padding: '0.5rem', opacity: 0.7, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Lado derecho: Resumen de compra */}
        <div className="card" style={{ position: 'sticky', top: '100px', alignSelf: 'start', borderTop: '4px solid var(--gold-main)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Resumen de compra
          </h2>
          
          <div className="flex justify-between" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            <span>Subtotal ({cart.length} productos)</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <span>Costo de envío</span>
            <span>{envio === 0 ? <span style={{ color: 'var(--success-color, #10b981)' }}>¡Gratis!</span> : `$${envio.toLocaleString()}`}</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed var(--border-subtle)', margin: '1.5rem 0' }} />

          <div className="flex justify-between" style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>
            <span>Total</span>
            <span style={{ color: 'var(--gold-main)' }}>${total.toLocaleString()}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => {
              const mensaje = `Hola! Quiero armar este pedido:%0A` + 
                cart.map(i => `- ${i.quantity}x ${i.nombre} ($${(Number(i.precio) * i.quantity).toLocaleString()})`).join('%0A') + 
                `%0A%0A*Total:* $${total.toLocaleString()}`;
              window.open(`https://wa.me/1234567890?text=${mensaje}`, '_blank');
            }}
          >
            Finalizar Compra <ArrowRight size={18} />
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Al pagar estás aceptando nuestros términos de servicio.
          </p>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .cart-item { flex-wrap: wrap; justify-content: center; }
          .cart-container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
