import { useState } from 'react';

/**
 * Converts the pointer position over an element into 3D rotation values,
 * so everything inside tilts while the visitor moves their mouse.
 */
export const use3DTilt = (maxTilt) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handlePointerMove = (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const px = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        const py = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
        setTilt({ x: -py * maxTilt, y: px * maxTilt });
    };

    const handlePointerLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return { tilt, handlePointerMove, handlePointerLeave };
};
