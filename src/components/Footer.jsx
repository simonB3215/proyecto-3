import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 0 2rem',
      backgroundColor: 'var(--bg-secondary)',
      marginTop: 'auto'
    }}>
      <div className="container grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <span className="heading-md text-gradient-gold">El Dorado</span>
          <p className="text-muted" style={{ marginTop: '1rem' }}>
            Tu supermercado premium, donde la calidad es la regla de oro.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h4 className="heading-sm" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Enlaces</h4>
          <Link to="/" className="text-muted hover-gold">Inicio</Link>
          <Link to="/shop" className="text-muted hover-gold">Comprar</Link>
          <Link to="/blog" className="text-muted hover-gold">Nuestra Historia</Link>
        </div>
        
        <div className="flex flex-col gap-2">
          <h4 className="heading-sm" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h4>
          <span className="text-muted">Términos y Condiciones</span>
          <span className="text-muted">Privacidad</span>
        </div>
      </div>
      
      <div className="container items-center" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} El Dorado Supermercado. Todos los derechos reservados.
        </p>
      </div>

      <style>{`
        .hover-gold:hover { color: var(--gold-main); }
      `}</style>
    </footer>
  );
};

export default Footer;
