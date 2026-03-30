import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      <Navigation />
      <main className="flex-col" style={{ flex: 1, marginTop: '70px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
