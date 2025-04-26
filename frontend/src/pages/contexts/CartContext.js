import React, { createContext, useState, useContext } from "react";

// Create the CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add item to cart
  const addToCart = (food) => {
    setCartItems((prevItems) => [...prevItems, food]);
  };

  // Function to remove item from cart
  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== foodId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
