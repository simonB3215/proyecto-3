import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { cartItemsCount, favorites } = useShop();
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navStyles = {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 50,
    transition: 'all var(--transition-normal)',
    backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(16px)' : 'none',
    borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
    padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
  };

  const linkClass = ({ isActive }) => 
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      <style>{`
        .nav-link {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--gold-main);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--gold-main);
          transition: width var(--transition-fast);
        }
        .nav-link.active::after {
          width: 100%;
        }
        .mobile-menu {
          position: fixed;
          inset: 0;
          background: var(--bg-primary);
          z-index: 40;
          display: flex;
          flex-direction: column;
          padding: 6rem 2rem 2rem;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-menu.open {
          transform: translateY(0);
        }
      `}</style>
      
      <header style={navStyles}>
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="heading-md text-gradient-gold">El Dorado</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-8" style={{ display: 'none' }} id="desktop-nav">
            <NavLink to="/" className={linkClass}>Inicio</NavLink>
            <NavLink to="/shop" className={linkClass}>Tienda</NavLink>
            <NavLink to="/blog" className={linkClass}>Blog</NavLink>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 gap-md-4">
            <Link to="/favorites" className="btn btn-ghost" aria-label="Favorites" style={{ padding: '0.5rem', position: 'relative' }}>
              <Heart size={20} />
              {favorites.length > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-5px', right: '-5px', 
                  background: 'var(--gold-main)', color: 'black', 
                  borderRadius: '50%', width: '18px', height: '18px', 
                  fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
                }}>
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="btn btn-ghost" aria-label="Cart" style={{ padding: '0.5rem', position: 'relative' }}>
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span style={{ 
                  position: 'absolute', top: '-5px', right: '-5px', 
                  background: 'var(--gold-main)', color: 'black', 
                  borderRadius: '50%', width: '18px', height: '18px', 
                  fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
                }}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3" id="btn-login-desktop">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Hola, <b style={{ color: 'var(--text-primary)' }}>{profile?.nombre || 'Usuario'}</b>
                </span>
                <button onClick={signOut} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Salir
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle} 
                className="btn btn-primary flex items-center gap-2" 
                id="btn-login-desktop" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', backgroundColor: '#ffffff', color: '#000000', border: '1px solid transparent' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                Entrar
              </button>
            )}
            <button 
              className="btn btn-ghost sm-hidden" 
              style={{ padding: '0.5rem', display: 'block' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="flex flex-col gap-6" style={{ fontSize: '1.5rem' }}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={linkClass}>Inicio</NavLink>
          <NavLink to="/shop" onClick={() => setMobileMenuOpen(false)} className={linkClass}>Tienda</NavLink>
          <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={linkClass}>Blog</NavLink>
          <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={linkClass}>Dashboard</NavLink>
          {user ? (
            <div className="flex flex-col gap-4" style={{ marginTop: '1rem' }}>
              <div className="flex items-center gap-3 justify-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Hola, <b>{profile?.nombre || 'Usuario'}</b></span>
              </div>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="btn btn-outline flex items-center justify-center gap-2" style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem', width: '100%' }}>
                <LogOut size={20} /> Salir
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { signInWithGoogle(); }} 
              className="btn btn-primary flex items-center gap-3" 
              style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem', marginTop: '1rem', width: '100%', justifyContent: 'center', backgroundColor: '#ffffff', color: '#000000', border: '1px solid transparent' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              Conectar con Google
            </button>
          )}
        </nav>
      </div>

      <style>{`
        #btn-login-desktop { display: none; }
        
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
          #btn-login-desktop { display: inline-flex; }
          .gap-md-4 { gap: 1rem !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
