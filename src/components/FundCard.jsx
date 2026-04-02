import React from 'react';
import TrendChart from './TrendChart';
import { useSwipe } from '../hooks/useSwipe';
import { TYPE_COLORS } from '../data/funds';
import './FundCard.css';

function StatBox({ label, value, valueColor }) {
  return (
    <div className="stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={valueColor ? { color: valueColor } : undefined}>{value}</span>
    </div>
  );
}

export default function FundCard({ fund, onSwipeLeft, onSwipeRight, zIndex, scale, offsetY, isTop }) {
  const { dragState, handlers, style, likeOpacity, nopeOpacity } = useSwipe({
    onSwipeLeft,
    onSwipeRight,
  });

  const isUp = fund.changePct >= 0;
  const typeColor = TYPE_COLORS[fund.type] || { bg: '#F3F4F6', text: '#374151' };

  const cardStyle = isTop
    ? { ...style, zIndex, transform: style.transform }
    : {
        zIndex,
        transform: `scale(${scale}) translateY(${offsetY}px)`,
        transition: 'transform 0.3s ease',
        pointerEvents: 'none',
      };

  return (
    <div
      className={`fund-card${isTop ? ' top' : ''}`}
      style={cardStyle}
      {...(isTop ? handlers : {})}
    >
      {/* Swipe Hints */}
      <div className="swipe-hint buy-hint" style={{ opacity: likeOpacity }}>
        BUY
      </div>
      <div className="swipe-hint pass-hint" style={{ opacity: nopeOpacity }}>
        PASS
      </div>

      {/* Card Header */}
      <div className="card-header">
        <div className="price-block">
          <div className="current-price">
            ₹{fund.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`price-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? '▲' : '▼'} ₹{Math.abs(fund.change).toFixed(2)} ({isUp ? '+' : ''}{fund.changePct.toFixed(2)}%)
          </div>
        </div>
        <span
          className="type-badge"
          style={{ background: typeColor.bg, color: typeColor.text }}
        >
          {fund.type}
        </span>
      </div>

      {/* Fund Identity */}
      <div className="fund-name">{fund.name}</div>
      <div className="fund-meta">
        <span className="fund-ticker">{fund.ticker}</span>
        <span className="fund-meta-sep">·</span>
        <span className="fund-period">7-day trend</span>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <TrendChart fund={fund} />
      </div>

      {/* Stats */}
      <div className="stats-row">
        <StatBox label="AUM" value={fund.aum} />
        <StatBox label="Exp Ratio" value={fund.expRatio} />
        <StatBox
          label="1Y Return"
          value={fund.oneYr}
          valueColor={fund.oneYrPositive ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Tags */}
      <div className="tags-row">
        {fund.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}
