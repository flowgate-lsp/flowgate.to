import React, { useEffect, useRef } from 'react';

const LiquidityFlow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle class for "Liquidity Packets"
    class Particle {
      constructor() {
        this.reset();
        // Start at random y to pre-fill screen
        this.y = Math.random() * canvas.height; 
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * 200; // Start above screen
        this.speed = Math.random() * 2 + 1; // Variable speed
        this.length = Math.random() * 20 + 10; // Trail length
        this.width = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        // Color variation: mostly blue/purple (Lightning), rare gold (Bitcoin)
        this.isGold = Math.random() > 0.95; 
      }

      update() {
        this.y += this.speed;
        
        // If particle hits the "ground" (approx 80% down or bottom) or goes off screen
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        // Create gradient trail
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
        
        if (this.isGold) {
            gradient.addColorStop(0, `rgba(255, 215, 0, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        } else {
            gradient.addColorStop(0, `rgba(100, 200, 255, ${this.opacity})`);
            gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.length);
        ctx.stroke();
      }
    }

    // Initialize particles
    const initParticles = () => {
      const count = Math.floor(window.innerWidth / 15); // Density
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0, // Behind content, above background image (-1)
        pointerEvents: 'none',
        opacity: 0.6 // Blend with background
      }}
    />
  );
};

export default LiquidityFlow;
