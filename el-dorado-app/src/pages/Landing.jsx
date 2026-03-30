import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Blur */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: 'var(--gold-dark)',
          filter: 'blur(200px)',
          opacity: 0.15,
          zIndex: -1,
          borderRadius: '50%'
        }}></div>

        <div className="container flex-col gap-6" style={{ alignItems: 'center', textAlign: 'center', maxWidth: '800px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '2rem',
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-gold)',
            color: 'var(--gold-main)',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '1rem'
          }}>
            <Star size={16} fill="var(--gold-main)" /> Premium Department Store
          </div>
          
          <h1 className="heading-xl">
            Descubre el estándar de <br />
            <span className="text-gradient-gold">Calidad Dorada</span>
          </h1>
          
          <p className="text-muted" style={{ fontSize: '1.25rem', marginTop: '1rem', maxWidth: '600px' }}>
            Productos seleccionados de electrónica, hogar y moda con el más alto rigor. Vive la experiencia de comprar como nunca antes.
          </p>
          
          <div className="flex gap-4" style={{ marginTop: '2.5rem', justifyContent: 'center' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              <ShoppingBag size={20} /> Explorar Catálogo
            </Link>
            <Link to="/blog" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Nuestra Historia
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="heading-lg">¿Por qué <span className="text-gradient-gold">El Dorado</span>?</h2>
            <p className="text-muted" style={{ marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0' }}>Hemos redefinido lo que significa comprar en línea. Tu tiempo vale oro.</p>
          </div>
          
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { icon: <ShieldCheck size={32} color="var(--gold-main)"/>, title: 'Calidad Impecable', desc: 'Sello de garantía directamente de fábrica en cada uno de nuestros estantes.' },
              { icon: <Truck size={32} color="var(--gold-main)"/>, title: 'Entrega Flash', desc: 'De la tienda a la puerta de tu casa en tiempo récord.' },
              { icon: <Star size={32} color="var(--gold-main)"/>, title: 'Soporte 5 Estrellas', desc: 'Asistentes de venta personales disponibles a un clic en todo momento.' }
            ].map((b, i) => (
              <div key={i} className="card flex-col gap-4" style={{ alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(234, 179, 8, 0.1)' }}>
                  {b.icon}
                </div>
                <h3 className="heading-md" style={{ fontSize: '1.25rem' }}>{b.title}</h3>
                <p className="text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
