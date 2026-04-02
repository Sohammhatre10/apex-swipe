import React, { useState, useEffect } from 'react';
import './BuyPanel.css';

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

export default function BuyPanel({ fund, isOpen, onClose, onConfirm }) {
  const [amount, setAmount] = useState('5000');
  const [orderType, setOrderType] = useState('instant');
  const [limitPrice, setLimitPrice] = useState('');

  useEffect(() => {
    if (fund) {
      setLimitPrice(fund.price.toFixed(2));
    }
  }, [fund]);

  if (!fund) return null;

  function handleConfirm() {
    onConfirm?.({
      fund,
      amount: parseInt(amount),
      orderType,
      limitPrice: orderType === 'limit' ? parseFloat(limitPrice) : null,
    });
    onClose();
  }

  return (
    <>
      <div
        className={`panel-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div className={`buy-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-handle" />

        <div className="panel-header">
          <div className="panel-eyebrow">You're buying</div>
          <div className="panel-fund-name">{fund.name}</div>
          <div className="panel-price">
            Current price:{' '}
            <strong>
              ₹{fund.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        {/* Amount Input */}
        <div className="amount-section">
          <div className="amount-input-wrap">
            <span className="currency-sym">₹</span>
            <input
              className="amount-input"
              type="number"
              value={amount}
              min="100"
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="quick-amounts">
            {QUICK_AMOUNTS.map(a => (
              <button
                key={a}
                className={`quick-btn ${parseInt(amount) === a ? 'active' : ''}`}
                onClick={() => setAmount(String(a))}
              >
                ₹{a >= 1000 ? `${a / 1000}K` : a}
              </button>
            ))}
          </div>
        </div>

        {/* Order Type */}
        <div className="order-section">
          <div className="section-label">Order type</div>
          <div className="order-types">
            <button
              className={`order-type-btn ${orderType === 'instant' ? 'selected' : ''}`}
              onClick={() => setOrderType('instant')}
            >
              <span className="ot-icon">⚡</span>
              <span className="ot-name">Instant Buy</span>
              <span className="ot-desc">At market price</span>
            </button>
            <button
              className={`order-type-btn ${orderType === 'limit' ? 'selected' : ''}`}
              onClick={() => setOrderType('limit')}
            >
              <span className="ot-icon">🎯</span>
              <span className="ot-name">Limit Order</span>
              <span className="ot-desc">Set target price</span>
            </button>
          </div>
        </div>

        {/* Limit Price */}
        <div className={`limit-section ${orderType === 'limit' ? 'visible' : ''}`}>
          <div className="section-label">Limit price</div>
          <div className="limit-input-wrap">
            <span className="currency-sym small">₹</span>
            <input
              className="limit-input"
              type="number"
              value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              placeholder="Enter target price"
            />
          </div>
        </div>

        {/* Order Summary */}
        {amount && parseInt(amount) > 0 && (
          <div className="order-summary">
            <span className="summary-label">Est. units</span>
            <span className="summary-value">
              ~{(parseInt(amount) / fund.price).toFixed(3)}
            </span>
          </div>
        )}

        <button className="confirm-btn" onClick={handleConfirm}>
          {orderType === 'instant' ? '⚡ Buy Now' : '🎯 Place Limit Order'}
        </button>
      </div>
    </>
  );
}
