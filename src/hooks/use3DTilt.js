import { useRef, useState } from 'react';

export function use3DTilt(maxTilt = 10, baseScale = 1) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const hoverScale = (baseScale * 1.01).toFixed(3);

    setStyle({
      transform: `scale3d(${hoverScale}, ${hoverScale}, ${hoverScale})`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `scale3d(${baseScale}, ${baseScale}, ${baseScale})`,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    });
  };

  return { ref, style, handleMouseMove, handleMouseLeave };
}
