import React, { useEffect, useRef } from 'react';

const MechAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Config
    const NODE_COUNT = 30; // Number of potential points for lights/lightning
    const TOP_AREA_RATIO = 0.4; // Only animate in top 40% of screen
    
    // State
    const nodes = [];
    const lightnings = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * TOP_AREA_RATIO);
        // Blinking light properties
        this.isLight = Math.random() > 0.7; // 30% chance to be a blinking light
        this.blinkSpeed = 0.02 + Math.random() * 0.05;
        this.opacity = Math.random();
        this.blinkDirection = 1;
        this.color = Math.random() > 0.8 ? '#ffffff' : '#a5b4fc'; // Mostly Blue, rare White lights
      }

      update() {
        if (!this.isLight) return;

        this.opacity += this.blinkSpeed * this.blinkDirection;
        if (this.opacity >= 1 || this.opacity <= 0.2) {
          this.blinkDirection *= -1;
        }
      }

      draw() {
        if (!this.isLight) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Lightning {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.life = 1.0; // Life starts at 1, fades to 0
        this.decay = 0.1 + Math.random() * 0.1; // How fast it fades
        this.segments = [];
        this.generateSegments();
      }

      generateSegments() {
        // Simple jagged line generation
        const dx = this.endNode.x - this.startNode.x;
        const dy = this.endNode.y - this.startNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(distance / 10);
        
        let currentX = this.startNode.x;
        let currentY = this.startNode.y;

        this.segments.push({ x: currentX, y: currentY });

        for (let i = 1; i < steps; i++) {
          const progress = i / steps;
          const noise = (Math.random() - 0.5) * 20; // Jaggedness
          
          currentX = this.startNode.x + dx * progress + (Math.random() - 0.5) * 10;
          currentY = this.startNode.y + dy * progress + noise;
          
          this.segments.push({ x: currentX, y: currentY });
        }
        
        this.segments.push({ x: this.endNode.x, y: this.endNode.y });
      }

      update() {
        this.life -= this.decay;
      }

      draw() {
        if (this.life <= 0) return;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(165, 180, 252, ${this.life})`; // Light blue/purple
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a5b4fc';

        const first = this.segments[0];
        ctx.moveTo(first.x, first.y);

        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node());
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update/Draw Nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Manage Lightning
      // Chance to spawn new lightning
      if (Math.random() < 0.05) { // 5% chance per frame
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        // Find a nearby node
        let end = null;
        let minDist = Infinity;
        
        nodes.forEach(other => {
          if (other === start) return;
          const d = Math.hypot(other.x - start.x, other.y - start.y);
          if (d < 300 && d > 50) { // Limit max length and min length
             // Prefer closer nodes but with some randomness
             if (d < minDist && Math.random() > 0.3) {
                minDist = d;
                end = other;
             }
          }
        });

        if (end) {
          lightnings.push(new Lightning(start, end));
        }
      }

      // Update/Draw Lightnings
      for (let i = lightnings.length - 1; i >= 0; i--) {
        const l = lightnings[i];
        l.update();
        l.draw();
        if (l.life <= 0) {
          lightnings.splice(i, 1);
        }
      }

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
        width: '100%',
        height: '100%',
        zIndex: 0, // Above background (-1) but below content (1)
        pointerEvents: 'none',
      }}
    />
  );
};

export default MechAnimation;
