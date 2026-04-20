'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotV: number;
  scale: number;
  scalePhase: number;
  w: number;
  h: number;
}

const ICONS = [
  {
    label: 'Notion',
    svg: '<path d="M4 4h4v16H4zM10 4h2l8 12V4h2v16h-2L12 8v12h-2z"/>',
    fill: true,
  },
  {
    label: 'GitHub',
    svg: '<path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>',
    fill: true,
  },
  {
    label: 'VS Code',
    svg: '<path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>',
    fill: true,
  },
  {
    label: 'Browser',
    svg: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="6" r="1" fill="currentColor"/>',
    fill: false,
  },
  {
    label: 'Terminal',
    svg: '<rect x="2" y="3" width="20" height="18" rx="2"/><polyline points="8 10 12 14 8 18"/><line x1="14" y1="18" x2="20" y2="18"/>',
    fill: false,
  },
  {
    label: 'Txt file',
    svg: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>',
    fill: false,
  },
  {
    label: 'Bookmarks',
    svg: '<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>',
    fill: false,
  },
  {
    label: 'Slack',
    svg: '<path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z"/>',
    fill: true,
  },
];

export default function ChaosAnimation() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const iconEls = Array.from(stage.querySelectorAll<HTMLElement>('[data-chaos-icon]'));
    const stageW = () => stage.clientWidth;
    const stageH = () => stage.clientHeight;

    const particles: Particle[] = iconEls.map((el) => {
      const w = 50;
      const h = 50;
      const speed = 0.4 + Math.random() * 0.5;
      const angle = Math.random() * Math.PI * 2;
      return {
        el,
        x: Math.random() * Math.max(0, stageW() - w),
        y: Math.random() * Math.max(0, stageH() - h),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 0.3,
        scale: 1,
        scalePhase: Math.random() * Math.PI * 2,
        w,
        h,
      };
    });

    const REPEL_RADIUS = 90;
    const REPEL_FORCE = 2.5;

    const onMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('mouseleave', onMouseLeave);

    // Re-measure after layout settles
    const startRaf = requestAnimationFrame(() => {
      particles.forEach((p) => {
        const rect = p.el.getBoundingClientRect();
        p.w = rect.width || 50;
        p.h = rect.height || 50;
        p.x = Math.min(p.x, stageW() - p.w);
        p.y = Math.min(p.y, stageH() - p.h);
      });

      function tick() {
        const sw = stageW();
        const sh = stageH();
        const { x: mx, y: my } = mouseRef.current;

        particles.forEach((p) => {
          p.scalePhase += 0.012;
          p.scale = 0.88 + Math.sin(p.scalePhase) * 0.12;
          p.rot += p.rotV;

          const cx = p.x + p.w / 2;
          const cy = p.y + p.h / 2;
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS && dist > 0) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 2.2) {
            p.vx = (p.vx / speed) * 2.2;
            p.vy = (p.vy / speed) * 2.2;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
          if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
          if (p.x + p.w > sw) { p.x = sw - p.w; p.vx = -Math.abs(p.vx); }
          if (p.y + p.h > sh) { p.y = sh - p.h; p.vy = -Math.abs(p.vy); }

          if (dist > REPEL_RADIUS) {
            const cur = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (cur > 0.45) {
              p.vx *= 0.985;
              p.vy *= 0.985;
            } else if (cur < 0.1) {
              const a = Math.random() * Math.PI * 2;
              p.vx += Math.cos(a) * 0.1;
              p.vy += Math.sin(a) * 0.1;
            }
          }

          p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
        });

        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(startRaf);
      cancelAnimationFrame(rafRef.current);
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full h-[210px] overflow-hidden"
    >
      {ICONS.map((icon) => (
        <div
          key={icon.label}
          data-chaos-icon
          className="absolute flex flex-col items-center gap-1 cursor-default select-none will-change-transform group"
          style={{ top: 0, left: 0 }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white/40 group-hover:text-white/70 transition-colors"
            fill={icon.fill ? 'currentColor' : 'none'}
            stroke={icon.fill ? 'none' : 'currentColor'}
            strokeWidth={icon.fill ? undefined : 2}
            dangerouslySetInnerHTML={{ __html: icon.svg }}
          />
          <span className="text-[0.55rem] text-white/25 whitespace-nowrap">{icon.label}</span>
        </div>
      ))}
    </div>
  );
}
