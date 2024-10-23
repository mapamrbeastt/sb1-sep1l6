import React, { useState, useEffect } from 'react';

interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({ show, children }) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  return (
    shouldRender && (
      <div
        style={{
          animation: `${show ? 'fadeIn' : 'fadeOut'} 0.3s ease-in-out`,
          opacity: show ? 1 : 0,
        }}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    )
  );
};

export default FadeTransition;