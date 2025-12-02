import { useEffect, useRef, useState } from 'react';

interface CircularViewportProps {
  children: React.ReactNode;
  size?: number;
  className?: string;
}

const CircularViewport = ({ children, size = 300, className = '' }: CircularViewportProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    angle: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    orbitRadius: 30,
    dragging: false,
    dragStart: null as any
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.4;

      // Clear
      ctx.fillStyle = '#0f1724';
      ctx.fillRect(0, 0, w, h);

      // Create circular mask
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Calculate orbit position
      const orbitX = state.orbitRadius * Math.cos(state.angle);
      const orbitY = state.orbitRadius * Math.sin(state.angle);

      // Draw content (simplified - in real implementation would render HTML to canvas)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(
        cx - 100 + orbitX + state.offsetX,
        cy - 100 + orbitY + state.offsetY,
        200 * state.scale,
        200 * state.scale
      );

      ctx.restore();

      // Draw border
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 4;
      ctx.stroke();
    };

    // Wheel handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        // Zoom
        const zoomFactor = Math.exp(-e.deltaY * 0.002);
        setState(prev => ({
          ...prev,
          scale: Math.max(0.3, Math.min(3, prev.scale * zoomFactor))
        }));
      } else {
        // Rotate
        setState(prev => ({
          ...prev,
          angle: prev.angle + e.deltaY * 0.01
        }));
      }
    };

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => {
      setState(prev => ({
        ...prev,
        dragging: true,
        dragStart: { x: e.clientX, y: e.clientY, startOffsetX: prev.offsetX, startOffsetY: prev.offsetY }
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.dragging || !state.dragStart) return;
      const dx = e.clientX - state.dragStart.x;
      const dy = e.clientY - state.dragStart.y;
      setState(prev => ({
        ...prev,
        offsetX: prev.dragStart.startOffsetX + dx,
        offsetY: prev.dragStart.startOffsetY + dy
      }));
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, dragging: false, dragStart: null }));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial draw
    draw();

    // Animation loop
    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full cursor-grab"
        style={{ width: size, height: size }}
      />
      <div
        ref={contentRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          transform: `translate(${state.offsetX}px, ${state.offsetY}px) scale(${state.scale}) rotate(${state.angle}rad)`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CircularViewport;