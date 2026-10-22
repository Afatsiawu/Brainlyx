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
