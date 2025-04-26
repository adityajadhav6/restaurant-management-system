import React, { useState, useEffect } from 'react';

const menuItems = [
  { name: 'Pizza', price: 200 },
  { name: 'Fries', price: 80 },
  { name: 'Soda', price: 50 },
  { name: 'Water', price: 20 },
];

const OrderModal = ({ table, onClose, onSaveOrders }) => {
  const [orders, setOrders] = useState(table ? table.orders : []);
  const [showBill, setShowBill] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    if (table && table.orders) {
      setOrders(table.orders);
    }
  }, [table]);

  const addItem = (item, quantity = 1) => {
    const updatedOrders = [...orders, { ...item, quantity }];
    setOrders(updatedOrders);
    onSaveOrders(table.id, updatedOrders); // Auto-save when an item is added
  };

  const deleteItem = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
    onSaveOrders(table.id, updatedOrders); // Auto-save when an item is deleted
  };

  const saveOrders = () => {
    onSaveOrders(table.id, orders); // Save the orders
    onClose(); // Close the modal after saving orders
  };

  const calculateTotal = () => {
    return orders.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateTax = (total) => {
    const gst = total * 0.05; // 5% GST
    return {
      cgst: gst / 2,
      sgst: gst / 2,
      totalWithGST: total + gst,
    };
  };

  const formatDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const handleGenerateBill = () => {
    // Ensure we save the current orders before showing the bill
    onSaveOrders(table.id, orders); // Save the orders
    setShowBill(true); // Show the bill after saving orders
  };

  const isItemAdded = (itemName) => {
    return orders.some(order => order.name === itemName);
  };

  const incrementQuantity = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].quantity += 1;
    setOrders(updatedOrders);
    onSaveOrders(table.id, updatedOrders); // Auto-save after increment
  };

  const decrementQuantity = (index) => {
    const updatedOrders = [...orders];
    if (updatedOrders[index].quantity > 1) {
      updatedOrders[index].quantity -= 1;
      setOrders(updatedOrders);
      onSaveOrders(table.id, updatedOrders); // Auto-save after decrement
    }
  };

  if (!table) {
    return <div>Table data not found!</div>;
  }

  const { cgst, sgst, totalWithGST } = calculateTax(calculateTotal());

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Orders for {table.id % 2 === 0 ? `R-${table.id}` : `T-${table.id}`}</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {!showBill && (
          <>
            <h4>Add Items:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {menuItems.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => addItem(item)} 
                  disabled={isItemAdded(item.name)} // Disable if item already added
                >
                  {item.name} - ₹{item.price} {isItemAdded(item.name) && '(Added)'}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              {orders.map((item, index) => (
                <div className="order-item" key={index} style={{ marginBottom: '10px' }}>
                  <span>{item.name} - ₹{item.price} x {item.quantity}</span>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() => decrementQuantity(index)}
                      disabled={item.quantity === 1} // Disable if quantity is 1
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => incrementQuantity(index)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="generate-bill" onClick={handleGenerateBill}>Generate Bill</button>
            <button className="generate-bill" onClick={saveOrders} style={{ backgroundColor: '#007bff' }}>Save Orders</button>
          </>
        )}

        {showBill && (
          <div className="bill-paper">
            <h3>Adi Cafe</h3>
            <p>Table: {table.id % 2 === 0 ? `R-${table.id}` : `T-${table.id}`}</p>
            <p>Date/Time: {formatDateTime()}</p>
            <hr />
            <ul>
              {orders.length > 0 ? (
                orders.map((item, idx) => (
                  <li key={idx}>
                    {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))
              ) : (
                <li>No orders yet.</li>
              )}
            </ul>
            <hr />
            <p>Subtotal: ₹{calculateTotal()}</p>
            <p>CGST (2.5%): ₹{cgst.toFixed(2)}</p>
            <p>SGST (2.5%): ₹{sgst.toFixed(2)}</p>
            <strong>Total: ₹{totalWithGST.toFixed(2)}</strong>
            <hr />
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <label>Payment Method:</label><br />
              <label><input type="radio" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} /> Cash</label><br />
              <label><input type="radio" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /> Card</label><br />
              <label><input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /> UPI</label>
            </div>
            <button className="generate-bill" style={{ marginTop: '20px' }}>Print Bill (Dummy)</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
