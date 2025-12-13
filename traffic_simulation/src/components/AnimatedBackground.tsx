import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix-style falling code effect
    class MatrixRain {
      x: number;
      y: number;
      speed: number;
      chars: string;
      fontSize: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height - canvas!.height;
        this.speed = Math.random() * 2 + 1;
        this.chars = '01';
        this.fontSize = 14;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = -this.fontSize;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(0, 255, 65, ${Math.random() * 0.5 + 0.3})`;
        ctx.font = `${this.fontSize}px monospace`;
        const char = this.chars[Math.floor(Math.random() * this.chars.length)];
        ctx.fillText(char, this.x, this.y);
      }
    }

    // Particle system for floating nodes
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        
        const colors = [
          'rgba(14, 165, 233, 0.4)',   // sky-500
          'rgba(59, 130, 246, 0.4)',   // blue-500
          'rgba(99, 102, 241, 0.4)',   // indigo-500
          'rgba(139, 92, 246, 0.4)',   // violet-500
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Grid lines
    class GridLine {
      y: number;
      speed: number;
      opacity: number;

      constructor() {
        this.y = Math.random() * canvas!.height;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.1 + 0.05;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = 0;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas!.width, this.y);
        ctx.stroke();
      }
    }

    // Create elements
    const matrixRains: MatrixRain[] = [];
    for (let i = 0; i < 50; i++) {
      matrixRains.push(new MatrixRain());
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    const gridLines: GridLine[] = [];
    for (let i = 0; i < 20; i++) {
      gridLines.push(new GridLine());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      gridLines.forEach(line => {
        line.update();
        line.draw(ctx);
      });

      // Draw matrix rain
      matrixRains.forEach(rain => {
        rain.update();
        rain.draw(ctx);
      });

      // Draw particle connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
