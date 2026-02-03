
import { useState, useEffect } from 'react';

const ProgressiveBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/bg.webp';
    img.onload = () => {
      setIsLoaded(true);
    };
  }, []);

  return (
    <div className="progressive-background">
      {/* Small placeholder - blurred */}
      <div 
        className="bg-layer placeholder"
        style={{ backgroundImage: "url('/bg-small.webp')" }}
      />
      
      {/* High-res image - fades in */}
      <div 
        className={`bg-layer high-res ${isLoaded ? 'loaded' : ''}`}
        style={{ backgroundImage: "url('/bg.webp')" }}
      />
    </div>
  );
};

export default ProgressiveBackground;
