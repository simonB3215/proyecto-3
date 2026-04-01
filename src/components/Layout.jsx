import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import dragonLogo from '../assets/dragon-logo.png';

const Layout = ({ children }) => {
  const { user, signInWithGoogle } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Mostrar siempre que no haya usuario logueado (en cada refresh)
    if (!user) {
      // Retraso para crear un efecto sorpresa
      const timer = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleRegister = () => {
    signInWithGoogle();
    handleClose(); // Cerrar el panel tras abrir el flow de inicio
  };

  return (
    <div className="flex flex-col relative" style={{ minHeight: '100vh', position: 'relative' }}>
      <Navigation />
      <main className="flex-col" style={{ flex: 1, marginTop: '70px' }}>
        {children}
      </main>
      <Footer />

      {/* PANEL DE REGISTRO AUTOMÁTICO - DISEÑO PREMIUM */}
      {showModal && (
        <div 
          className="animate-fade-in"
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(16px)',
            padding: '1rem'
          }}
        >
          <div 
            style={{ 
              position: 'relative',
              width: '100%', maxWidth: '440px',
              background: 'var(--bg-secondary)', 
              borderRadius: '24px',
              boxShadow: '0 0 40px rgba(234, 179, 8, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              animation: 'modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden'
            }}
          >
            {/* Animated Gold Top Border */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--gold-main), transparent)', opacity: 0.8 }}></div>
            
            {/* Background Glow Effects */}
            <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', left: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 60%)', pointerEvents: 'none' }}></div>

            <div style={{ position: 'relative', padding: '3rem 2.5rem', textAlign: 'center', border: '1px solid var(--border-subtle)', borderRadius: '24px', background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(10px)' }}>
              
              {/* Close Button X */}
              <button 
                onClick={handleClose}
                className="btn-ghost"
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <X size={20} />
              </button>

              {/* Logo / Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', boxShadow: '0 0 25px rgba(234, 179, 8, 0.3)', overflow: 'hidden' }}>
                  <img src={dragonLogo} alt="El Dorado Premium Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <h2 className="heading-lg text-gradient-gold" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                El Dorado
              </h2>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Únete a la Exclusividad
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Regístrate ahora para desbloquear <strong style={{color: 'var(--gold-main)', fontWeight: 600}}>envíos gratuitos</strong>, prioridad en nuevas colecciones y acceso sin límites a nuestra bóveda.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={handleRegister} 
                  style={{ 
                    display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    padding: '1rem', fontSize: '1.05rem', backgroundColor: '#ffffff', color: '#000000', 
                    border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,255,255,0.1)'; }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                  Registrarme con Google
                </button>
                
                <button 
                  onClick={handleClose} 
                  style={{ 
                    width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 500,
                    border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: '12px', 
                    color: 'rgba(234, 179, 8, 0.9)', background: 'transparent', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--gold-main)'; e.currentTarget.style.color = 'var(--gold-main)'; e.currentTarget.style.background = 'rgba(234, 179, 8, 0.05)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.2)'; e.currentTarget.style.color = 'rgba(234, 179, 8, 0.9)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Quizás más tarde
                </button>
              </div>
              
              <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.6 }}>
                Al continuar, aplicas a las normas de seguridad del prototipo.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes modalSlideUp {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
