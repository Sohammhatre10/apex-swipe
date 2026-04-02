import React, { useState, useCallback } from 'react';
import FundCard from './components/FundCard';
import BuyPanel from './components/BuyPanel';
import Toast from './components/Toast';
import { FUNDS } from './data/funds';
import './App.css';

const VISIBLE_CARDS = 3;

export default function App() {
  const [deck, setDeck] = useState(FUNDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [buyFund, setBuyFund] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [exitDir, setExitDir] = useState(null);

  const remaining = deck.length - currentIndex;

  function showToast(msg) {
    setToast(msg);
  }

  function findSimilar(fund) {
    return deck.find(
      f => f.id !== fund.id && f.tags.some(t => fund.tags.includes(t)) && deck.indexOf(f) !== currentIndex
    );
  }

  const handleSwipeRight = useCallback(() => {
    const fund = deck[currentIndex];
    setExitDir('right');
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setExitDir(null);
      setBuyFund(fund);
      setIsPanelOpen(true);
    }, 350);
  }, [deck, currentIndex]);

  const handleSwipeLeft = useCallback(() => {
    const fund = deck[currentIndex];
    setExitDir('left');
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setExitDir(null);
      const similar = findSimilar(fund);
      if (similar) {
        showToast(`Similar to this: ${similar.name}`);
      } else {
        showToast('No similar funds found nearby');
      }
    }, 350);
  }, [deck, currentIndex]);

  function handlePassBtn() {
    if (deck[currentIndex]) handleSwipeLeft();
  }

  function handleBuyBtn() {
    if (deck[currentIndex]) handleSwipeRight();
  }

  function handleWatchlist() {
    const fund = deck[currentIndex];
    if (!fund) return;
    setWatchlist(w => [...w, fund.id]);
    setExitDir('right');
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setExitDir(null);
      showToast(`★ ${fund.name} added to watchlist`);
    }, 350);
  }

  function handleConfirm({ fund, amount, orderType, limitPrice }) {
    const typeLabel = orderType === 'instant' ? 'instant buy' : 'limit order';
    showToast(`✓ ₹${amount.toLocaleString('en-IN')} ${typeLabel} placed for ${fund.ticker}`);
  }

  function handleReset() {
    setDeck([...FUNDS]);
    setCurrentIndex(0);
    setExitDir(null);
  }

  const visibleFunds = deck.slice(currentIndex, currentIndex + VISIBLE_CARDS);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          fund<span className="logo-accent">swipe</span>
        </div>
        <div className="header-right">
          {watchlist.length > 0 && (
            <div className="watchlist-badge">★ {watchlist.length}</div>
          )}
          <div className="deck-pill">{remaining} left</div>
        </div>
      </header>

      {/* Card Stack */}
      <div className="card-stack">
        {remaining === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-title">You've seen all funds</div>
            <div className="empty-sub">Time to revisit your picks</div>
            <button className="reset-btn" onClick={handleReset}>
              Start Over
            </button>
          </div>
        ) : (
          visibleFunds.map((fund, i) => {
            const isTop = i === 0;
            const scale = 1 - i * 0.04;
            const offsetY = i * 14;

            if (isTop && exitDir) {
              const exitX = exitDir === 'right' ? 600 : -600;
              const exitRot = exitDir === 'right' ? 20 : -20;
              return (
                <div
                  key={fund.id}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    transform: `translate(${exitX}px, 0) rotate(${exitRot}deg)`,
                    opacity: 0,
                    transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s',
                    pointerEvents: 'none',
                  }}
                >
                  <FundCard
                    fund={fund}
                    isTop={false}
                    zIndex={10}
                    scale={1}
                    offsetY={0}
                  />
                </div>
              );
            }

            return (
              <FundCard
                key={fund.id}
                fund={fund}
                isTop={isTop && !exitDir}
                zIndex={VISIBLE_CARDS - i}
                scale={scale}
                offsetY={offsetY}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-bar">
        <button
          className="action-btn pass-btn"
          onClick={handlePassBtn}
          title="Pass"
          disabled={remaining === 0}
        >
          <span className="btn-icon">✕</span>
        </button>
        <button
          className="action-btn watch-btn"
          onClick={handleWatchlist}
          title="Watchlist"
          disabled={remaining === 0}
        >
          <span className="btn-icon">★</span>
        </button>
        <button
          className="action-btn buy-btn"
          onClick={handleBuyBtn}
          title="Buy"
          disabled={remaining === 0}
        >
          <span className="btn-icon">✓</span>
        </button>
      </div>

      {/* Action labels */}
      <div className="action-labels">
        <span>Pass</span>
        <span>Watch</span>
        <span>Buy</span>
      </div>

      <BuyPanel
        fund={buyFund}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onConfirm={handleConfirm}
      />

      <Toast
        message={toast}
        onDone={() => setToast('')}
      />
    </div>
  );
}
