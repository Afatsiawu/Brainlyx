import { motion } from 'framer-motion';
import { use3DTilt } from './use3DTilt';

/**
 * A card that tilts in 3D towards the pointer it is hovered over,
 * then springs back once the pointer leaves.
 */
export const TiltCard = ({ children, className, maxTilt = 10, animate, ...rest }) => {
  const { tilt, handlePointerMove, handlePointerLeave } = use3DTilt(maxTilt);

  const combinedAnimate = {
    ...animate,
    rotateX: tilt.x,
    rotateY: tilt.y,
  };

  return (
    <motion.div
      className={className}
      animate={combinedAnimate}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

/**
 * A wrapper that renders its children inside a 3D space and slowly
 * rotates the whole scene around the X and Y axes.
 */
export const AutoRotating3D = ({ children, className, duration = 18 }) => (
  <div className={className} style={{ perspective: '1000px' }}>
    <motion.div
      animate={{ rotateX: 360, rotateY: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  </div>
);
