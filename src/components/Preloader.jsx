import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Elegant fade out after 800ms to hide initial hydration/layout sync
    const fadeTimeout = setTimeout(() => {
      setIsLoaded(true);
      const removeTimeout = setTimeout(() => {
        setShouldRender(false);
      }, 600); // Wait for the 0.6s CSS transition to complete
      return () => clearTimeout(removeTimeout);
    }, 800);

    return () => clearTimeout(fadeTimeout);
  }, []);

  if (!shouldRender) return null;

  return (
    <div className={`preloader-overlay ${isLoaded ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-spinner"></div>
      </div>
    </div>
  );
}
