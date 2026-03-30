import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Heart, LogIn, Menu, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navigation = () => {
  const { cartItemsCount, favorites } = useShop();
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
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost" aria-label="Favorites" style={{ padding: '0.5rem', position: 'relative' }}>
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
            </button>
            <button className="btn btn-ghost" aria-label="Cart" style={{ padding: '0.5rem', position: 'relative' }}>
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
            </button>
            <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
              <LogIn size={16} /> Entrar
            </button>
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
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          #desktop-nav { display: flex !important; }
          #mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navigation;
