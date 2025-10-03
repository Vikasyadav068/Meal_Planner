import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ShoppingList.css';

const ShoppingList = () => {
  const { currentUser } = useAuth();
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [customItem, setCustomItem] = useState('');
  const [categorizedList, setCategorizedList] = useState({});

  useEffect(() => {
    loadShoppingList();
  }, []);

  useEffect(() => {
    categorizeIngredients();
  }, [shoppingList]);

  const loadShoppingList = () => {
    const savedList = localStorage.getItem('shoppingList');
    const savedChecked = localStorage.getItem('checkedItems');
    
    if (savedList) {
      setShoppingList(JSON.parse(savedList));
    }
    
    if (savedChecked) {
      setCheckedItems(new Set(JSON.parse(savedChecked)));
    }
  };

  const categorizeIngredients = () => {
    const categories = {
      'Proteins': [],
      'Vegetables': [],
      'Fruits': [],
      'Dairy & Eggs': [],
      'Grains & Bread': [],
      'Spices & Seasonings': [],
      'Pantry': [],
      'Other': []
    };

    shoppingList.forEach((item, index) => {
      // Handle both string and object formats
      let itemText = '';
      if (typeof item === 'string') {
        itemText = item;
      } else if (item && typeof item === 'object') {
        // Handle ingredient objects with name, amount, unit properties
        if (item.name) {
          itemText = `${item.amount || ''} ${item.unit || ''} ${item.name}`.trim();
        } else if (item.text) {
          itemText = item.text;
        } else {
          itemText = String(item);
        }
      } else {
        itemText = String(item);
      }

      const lowerItem = itemText.toLowerCase();
      const itemWithId = { text: itemText, id: index };
      
      if (lowerItem.includes('chicken') || lowerItem.includes('beef') || lowerItem.includes('pork') || 
          lowerItem.includes('salmon') || lowerItem.includes('fish') || lowerItem.includes('turkey') ||
          lowerItem.includes('lamb') || lowerItem.includes('bacon') || lowerItem.includes('eggs')) {
        categories['Proteins'].push(itemWithId);
      } else if (lowerItem.includes('tomato') || lowerItem.includes('onion') || lowerItem.includes('garlic') || 
                 lowerItem.includes('pepper') || lowerItem.includes('cucumber') || lowerItem.includes('lettuce') ||
                 lowerItem.includes('spinach') || lowerItem.includes('broccoli') || lowerItem.includes('carrot') ||
                 lowerItem.includes('asparagus') || lowerItem.includes('zucchini') || lowerItem.includes('kale')) {
        categories['Vegetables'].push(itemWithId);
      } else if (lowerItem.includes('avocado') || lowerItem.includes('lemon') || lowerItem.includes('lime') ||
                 lowerItem.includes('berries') || lowerItem.includes('apple') || lowerItem.includes('banana')) {
        categories['Fruits'].push(itemWithId);
      } else if (lowerItem.includes('cheese') || lowerItem.includes('milk') || lowerItem.includes('cream') ||
                 lowerItem.includes('yogurt') || lowerItem.includes('butter') || lowerItem.includes('ricotta') ||
                 lowerItem.includes('mozzarella') || lowerItem.includes('parmesan') || lowerItem.includes('feta')) {
        categories['Dairy & Eggs'].push(itemWithId);
      } else if (lowerItem.includes('quinoa') || lowerItem.includes('rice') || lowerItem.includes('bread') ||
                 lowerItem.includes('pasta') || lowerItem.includes('flour') || lowerItem.includes('dough') ||
                 lowerItem.includes('shells') || lowerItem.includes('pita')) {
        categories['Grains & Bread'].push(itemWithId);
      } else if (lowerItem.includes('salt') || lowerItem.includes('pepper') || lowerItem.includes('cumin') ||
                 lowerItem.includes('paprika') || lowerItem.includes('oregano') || lowerItem.includes('basil') ||
                 lowerItem.includes('thyme') || lowerItem.includes('rosemary') || lowerItem.includes('garam masala') ||
                 lowerItem.includes('turmeric') || lowerItem.includes('chili') || lowerItem.includes('herbs') ||
                 lowerItem.includes('seasoning') || lowerItem.includes('spice')) {
        categories['Spices & Seasonings'].push(itemWithId);
      } else if (lowerItem.includes('oil') || lowerItem.includes('vinegar') || lowerItem.includes('sauce') ||
                 lowerItem.includes('broth') || lowerItem.includes('stock') || lowerItem.includes('honey') ||
                 lowerItem.includes('maple syrup') || lowerItem.includes('cocoa') || lowerItem.includes('vanilla')) {
        categories['Pantry'].push(itemWithId);
      } else {
        categories['Other'].push(itemWithId);
      }
    });

    setCategorizedList(categories);
  };

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
    localStorage.setItem('checkedItems', JSON.stringify([...newChecked]));
  };

  const addCustomItem = () => {
    if (customItem.trim()) {
      const newList = [...shoppingList, customItem.trim()];
      setShoppingList(newList);
      localStorage.setItem('shoppingList', JSON.stringify(newList));
      setCustomItem('');
    }
  };

  const removeItem = (index) => {
    const newList = shoppingList.filter((_, i) => i !== index);
    setShoppingList(newList);
    localStorage.setItem('shoppingList', JSON.stringify(newList));
    
    const newChecked = new Set([...checkedItems].filter(i => i !== index).map(i => i > index ? i - 1 : i));
    setCheckedItems(newChecked);
    localStorage.setItem('checkedItems', JSON.stringify([...newChecked]));
  };

  const clearList = () => {
    setShoppingList([]);
    setCheckedItems(new Set());
    localStorage.removeItem('shoppingList');
    localStorage.removeItem('checkedItems');
  };

  const clearChecked = () => {
    const uncheckedItems = shoppingList.filter((_, index) => !checkedItems.has(index));
    setShoppingList(uncheckedItems);
    setCheckedItems(new Set());
    localStorage.setItem('shoppingList', JSON.stringify(uncheckedItems));
    localStorage.removeItem('checkedItems');
  };

  if (!currentUser) {
    return (
      <div className="shopping-list">
        <div className="auth-required">
          <h2>Please log in to access your Shopping List</h2>
          <p>Create a meal plan first to generate your shopping list!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-list">
      <div className="container">
        <h1>🛒 Shopping List</h1>
        
        <div className="shopping-header">
          <div className="list-stats">
            <span>Total Items: {shoppingList.length}</span>
            <span>Checked: {checkedItems.size}</span>
            <span>Remaining: {shoppingList.length - checkedItems.size}</span>
          </div>
          
          <div className="list-actions">
            <button className="clear-checked-btn" onClick={clearChecked}>
              Clear Checked
            </button>
            <button className="clear-all-btn" onClick={clearList}>
              Clear All
            </button>
          </div>
        </div>

        <div className="add-item-section">
          <div className="add-item-input">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Add custom item..."
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <button onClick={addCustomItem}>Add Item</button>
          </div>
        </div>

        {shoppingList.length === 0 ? (
          <div className="empty-list">
            <h3>Your shopping list is empty!</h3>
            <p>Create a meal plan to automatically generate your shopping list, or add items manually above.</p>
            <div className="empty-icon">🛒</div>
          </div>
        ) : (
          <div className="categorized-list">
            {Object.entries(categorizedList).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="category-section">
                  <h3 className="category-title">{category}</h3>
                  <div className="category-items">
                    {items.map(({ text, id }) => (
                      <div
                        key={id}
                        className={`shopping-item ${checkedItems.has(id) ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(id)}
                          onChange={() => toggleItem(id)}
                          id={`item-${id}`}
                        />
                        <label
                          htmlFor={`item-${id}`}
                          className="item-text"
                        >
                          {text}
                        </label>
                        <button
                          className="remove-item-btn"
                          onClick={() => removeItem(id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {shoppingList.length > 0 && (
          <div className="list-summary">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(checkedItems.size / shoppingList.length) * 100}%`
                }}
              />
            </div>
            <p>
              {checkedItems.size} of {shoppingList.length} items completed 
              ({Math.round((checkedItems.size / shoppingList.length) * 100)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
