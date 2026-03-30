import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
  // Initialize from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('elDorado_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('elDorado_favs');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });

  // Save to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('elDorado_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('elDorado_favs', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prevFavs => {
      if (prevFavs.includes(productId)) {
        return prevFavs.filter(id => id !== productId);
      }
      return [...prevFavs, productId];
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleFavorite,
    isFavorite,
    cartItemsCount
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
