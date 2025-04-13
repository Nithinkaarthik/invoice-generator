import React from 'react';
import { LineItem as LineItemType } from '../services/api';

interface LineItemProps {
  item: LineItemType;
  index: number;
  onUpdate: (index: number, updatedItem: LineItemType) => void;
  onDelete: (index: number) => void;
}

const LineItem: React.FC<LineItemProps> = ({ item, index, onUpdate, onDelete }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItem = { ...item, [name]: parseFloat(value) || 0 };
    
    // Auto-calculate total when quantity or rate changes
    if (name === 'quantity' || name === 'rate') {
      updatedItem.total = updatedItem.quantity * updatedItem.rate;
    }
    
    onUpdate(index, updatedItem);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedItem = { ...item, name: value };
    onUpdate(index, updatedItem);
  };

  return (
    <div className="line-item">
      <div className="line-item-row">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Item description"
            value={item.name}
            onChange={handleNameChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={item.quantity}
            onChange={handleChange}
            className="form-control"
            min="1"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="rate"
            placeholder="Rate"
            value={item.rate}
            onChange={handleChange}
            className="form-control"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group total-field">
          <span className="currency">$</span>
          <span className="line-total">{(item.total || 0).toFixed(2)}</span>
        </div>
        <button 
          onClick={() => onDelete(index)}
          className="delete-btn"
          type="button"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LineItem;