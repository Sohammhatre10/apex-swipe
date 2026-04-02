import { useState, useRef, useCallback } from 'react';

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const [dragState, setDragState] = useState({ x: 0, y: 0, isDragging: false });
  const startRef = useRef({ x: 0, y: 0, time: 0 });
  const cardRef = useRef(null);

  const handlePointerDown = useCallback((e) => {
    const pt = e.touches ? e.touches[0] : e;
    startRef.current = { x: pt.clientX, y: pt.clientY, time: Date.now() };
    setDragState({ x: 0, y: 0, isDragging: true });
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragState.isDragging) return;
    e.preventDefault?.();
    const pt = e.touches ? e.touches[0] : e;
    setDragState(prev => ({
      ...prev,
      x: pt.clientX - startRef.current.x,
      y: (pt.clientY - startRef.current.y) * 0.3,
    }));
  }, [dragState.isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragState.isDragging) return;
    const { x } = dragState;
    const elapsed = Date.now() - startRef.current.time;
    const velocity = Math.abs(x) / elapsed;

    setDragState({ x: 0, y: 0, isDragging: false });

    if (x > SWIPE_THRESHOLD || (x > 40 && velocity > VELOCITY_THRESHOLD)) {
      onSwipeRight?.();
    } else if (x < -SWIPE_THRESHOLD || (x < -40 && velocity > VELOCITY_THRESHOLD)) {
      onSwipeLeft?.();
    }
  }, [dragState, onSwipeLeft, onSwipeRight]);

  const rotation = dragState.x * 0.06;
  const likeOpacity = Math.max(0, Math.min(1, (dragState.x - 40) / 60));
  const nopeOpacity = Math.max(0, Math.min(1, (-dragState.x - 40) / 60));

  return {
    cardRef,
    dragState,
    handlers: {
      onMouseDown: handlePointerDown,
      onMouseMove: handlePointerMove,
      onMouseUp: handlePointerUp,
      onMouseLeave: handlePointerUp,
      onTouchStart: handlePointerDown,
      onTouchMove: handlePointerMove,
      onTouchEnd: handlePointerUp,
    },
    style: {
      transform: dragState.isDragging
        ? `translate(${dragState.x}px, ${dragState.y}px) rotate(${rotation}deg)`
        : undefined,
      cursor: dragState.isDragging ? 'grabbing' : 'grab',
      transition: dragState.isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
    },
    likeOpacity,
    nopeOpacity,
  };
}
