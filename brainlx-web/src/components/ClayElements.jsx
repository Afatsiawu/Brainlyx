import { use3DTilt } from './use3DTilt';

/**
 * A soft, puffy "clay" card: pastel gradient surface, big radius, layered
 * outer drop shadow + inner highlights. Tilts gently towards the pointer
 * (3D clay look) unless disabled.
 */
export const ClayCard = ({ children, className = '', maxTilt = 6, tilt = true, ...rest }) => {
    const { tilt: t, handlePointerMove, handlePointerLeave } = use3DTilt(maxTilt);

    return (
        <div
            className={`clay clay-interactive rounded-[2rem] ${className}`}
            onPointerMove={tilt ? handlePointerMove : undefined}
            onPointerLeave={tilt ? handlePointerLeave : undefined}
            style={tilt ? { transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)`, transformStyle: 'preserve-3d' } : undefined}
            {...rest}
        >
            {children}
        </div>
    );
};

/**
 * A clay button with a puffy raised shadow that presses down on click.
 * Variant "primary" is the gradient brand clay, "white" is the soft surface clay.
 */
export const ClayButton = ({ children, variant = 'primary', className = '', ...rest }) => (
    <button
        type="button"
        className={`clay-btn clay-btn-${variant} ${className}`}
        {...rest}
    >
        {children}
    </button>
);

/**
 * Small puffy clay container for icons / avatars / step numbers.
 */
export const ClayChip = ({ children, variant = 'surface', className = '', ...rest }) => {
    const variants = {
        surface: 'clay-chip',
        primary: 'clay-chip bg-primary/15 text-primary',
        secondary: 'clay-chip bg-secondary/15 text-secondary',
        accent: 'clay-chip bg-accent/15 text-accent',
        success: 'clay-chip bg-success/15 text-success',
    };

    return (
        <div
            className={`${variants[variant] || variants.surface} rounded-2xl ${className}`}
            {...rest}
        >
            {children}
        </div>
    );
};
