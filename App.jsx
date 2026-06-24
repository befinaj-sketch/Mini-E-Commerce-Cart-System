import React, { useState } from 'react';

// Sample product data
const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 89.99, category: 'Electronics' },
  { id: 2, name: 'Ergonomic Mouse', price: 45.50, category: 'Electronics' },
  { id: 3, name: 'Cotton T-Shirt', price: 24.99, category: 'Apparel' },
  { id: 4, name: 'Stainless Water Bottle', price: 19.99, category: 'Kitchen' },
];

// Constants for cost calculations
const TAX_RATE = 0.08; // 8%
const SHIPPING_THRESHOLD = 100; // Free shipping over $100
const FLAT_SHIPPING_FEE = 10;

export default function App() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Add item to cart or increment quantity if it already exists
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove or decrement item quantity
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Apply a basic coupon code (e.g., "SAVE10" for 10% off)
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setDiscountPercent(10);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "SAVE10"');
      setDiscountPercent(0);
    }
  };

  // --- Cost Calculations ---
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxedAmount = (subtotal - discountAmount) * TAX_RATE;
  const shippingCost = subtotal > SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  const totalCost = subtotal - discountAmount + taxedAmount + shippingCost;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Mini E-Commerce Cost System</h1>
        <p>Add items to see live tax, shipping, and discount calculations.</p>
      </header>

      <div style={styles.mainGrid}>
        {/* Product List Section */}
        <section style={styles.section}>
          <h2>Available Products</h2>
          <div style={styles.productGrid}>
            {PRODUCTS.map((product) => (
              <div key={product.id} style={styles.card}>
                <h3>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <p style={styles.price}>${product.price.toFixed(2)}</p>
                <button style={styles.button} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Cart & Cost breakdown Section */}
        <section style={styles.section}>
          <h2>Your Cart & Checkout</h2>
          
          {cart.length === 0 ? (
            <p style={styles.emptyText}>Your cart is empty.</p>
          ) : (
            <div>
              {/* Cart Items List */}
              <ul style={styles.cartList}>
                {cart.map((item) => (
                  <li key={item.id} style={styles.cartItem}>
                    <div>
                      <strong>{item.name}</strong> <br />
                      <span style={styles.mutedText}>
                        ${item.price.toFixed(2)} x {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                        -
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. SAVE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.couponBtn}>Apply</button>
              </form>
              {couponError && <p style={styles.errorText}>{couponError}</p>}
              {discountPercent > 0 && <p style={styles.successText}>Success! {discountPercent}% off applied.</p>}

              <hr style={styles.divider} />

              {/* Cost Breakdown Table */}
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td>Subtotal:</td>
                    <td style={styles.tableRight}>${subtotal.toFixed(2)}</td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr style={{ color: '#2e7d32' }}>
                      <td>Discount ({discountPercent}%):</td>
                      <td style={styles.tableRight}>-${discountAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Estimated Tax (8%):</td>
                    <td style={styles.tableRight}>${taxedAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>
                      Shipping: <br />
                      <small style={styles.mutedText}>
                        {subtotal > SHIPPING_THRESHOLD ? 'Free over $100!' : 'Flat $10 fee'}
                      </small>
                    </td>
                    <td style={styles.tableRight}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </td>
                  </tr>
                  <tr style={styles.totalRow}>
                    <td>Total Cost:</td>
                    <td style={styles.tableRight}>${totalCost.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// --- Basic Inline Styles ---
const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif', color: '#333' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' },
  section: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  productGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  card: { background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #ddd', textAlign: 'center' },
  category: { fontSize: '12px', color: '#777', textTransform: 'uppercase', margin: '5px 0' },
  price: { fontSize: '18px', fontWeight: 'bold', margin: '10px 0' },
  button: { background: '#0070f3', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' },
  emptyText: { color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' },
  cartList: { listStyle: 'none', padding: 0, margin: '0 0 20px 0' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
  mutedText: { fontSize: '13px', color: '#666' },
  removeBtn: { background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' },
  couponForm: { display: 'flex', gap: '10px', marginTop: '20px' },
  input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  couponBtn: { background: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
  errorText: { color: '#d32f2f', fontSize: '13px', marginTop: '5px' },
  successText: { color: '#2e7d32', fontSize: '13px', marginTop: '5px', fontWeight: 'bold' },
  divider: { margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  tableRight: { textAlign: 'right', fontWeight: 'bold' },
  totalRow: { fontSize: '20px', fontWeight: 'bold', borderTop: '2px solid #333', color: '#000' }
};