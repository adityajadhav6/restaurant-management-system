import React, { useState } from 'react';
import './App.css';
import OrderModal from './components/OrderModal';

function App() {
  const [tables, setTables] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: i % 2 === 0 ? `R-${i + 1}` : `T-${i + 1}`,
      status: 'vacant',
      orders: [],
    }))
  );

  const [activeTableId, setActiveTableId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleTableStatus = (id) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id
          ? {
              ...table,
              status:
                table.status === 'vacant'
                  ? 'occupied'
                  : table.status === 'occupied'
                  ? 'reservation'
                  : 'vacant',
            }
          : table
      )
    );
  };

  const openModal = (id) => {
    setActiveTableId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSaveOrders = (tableId, updatedOrders) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, orders: updatedOrders } : table
      )
    );
  };

  const deleteTable = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this table?');
    if (confirmDelete) {
      setTables((prev) => prev.filter((table) => table.id !== id));
    }
  };

  const addTable = () => {
    const newId = tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
    const newTable = {
      id: newId,
      name: newId % 2 === 0 ? `R-${newId}` : `T-${newId}`,
      status: 'vacant',
      orders: [],
    };
    setTables((prev) => [...prev, newTable]);
  };

  const renameTable = (id) => {
    const newName = prompt('Enter a new name for this table:');
    if (newName && newName.trim() !== '') {
      setTables((prev) =>
        prev.map((table) =>
          table.id === id ? { ...table, name: newName.trim() } : table
        )
      );
    }
  };

  const activeTable = tables.find((table) => table.id === activeTableId);

  return (
    <div className="App">
      <h1>Restaurant Table Overview</h1>
      <div className="legend">
        <span className="legend-item vacant">Vacant</span>
        <span className="legend-item occupied">Occupied</span>
        <span className="legend-item reservation">Reserved</span>
      </div>

      <button className="add-table-btn" onClick={addTable}>
        ➕ Add Table
      </button>

      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${table.status} ${
              table.id % 2 === 0 ? 'table-round' : 'table-rect'
            }`}
            onClick={() => toggleTableStatus(table.id)}
          >
            <span
              className="order-icon"
              onClick={(e) => {
                e.stopPropagation();
                openModal(table.id);
              }}
            >
              +
            </span>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteTable(table.id);
              }}
            >
              🗑️
            </button>

            <button
              className="rename-btn"
              onClick={(e) => {
                e.stopPropagation();
                renameTable(table.id);
              }}
            >
              ✏️
            </button>

            <h3>{table.name}</h3>
            <p>Status: {table.status}</p>
            <div className="chair top"></div>
            <div className="chair bottom"></div>
            <div className="chair left"></div>
            <div className="chair right"></div>
          </div>
        ))}
      </div>

      {modalVisible && activeTable && (
        <OrderModal
          table={activeTable}
          onClose={closeModal}
          onSaveOrders={handleSaveOrders}
        />
      )}
    </div>
  );
}

export default App;
