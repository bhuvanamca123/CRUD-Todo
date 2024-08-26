import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:5000/items');
    setItems(response.data);
  };

  const addItem = async () => {
    if (!newItem) return;
    await axios.post('http://localhost:5000/items', { name: newItem });
    setNewItem('');
    fetchItems();
  };

  const updateItem = async (id, name) => {
    await axios.put(`http://localhost:5000/items/${id}`, { name });
    setEditingItem(null);
    fetchItems();
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://localhost:5000/items/${id}`);
    fetchItems();
  };

  return (
    <div>
      <h1>CRUD Application</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add new item"
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {editingItem === item.id ? (
              <input
                type="text"
                defaultValue={item.name}
                onBlur={(e) => updateItem(item.id, e.target.value)}
              />
            ) : (
              <span>{item.name}</span>
            )}
            <button onClick={() => setEditingItem(item.id)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
