import React, { useState } from 'react';

interface LogoProps {
    src?: string;
    size?: number;
    alt?: string;
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ src = '../src/assets/EMS.png', size = 120, alt = 'EMS logo', className }) => {
    const [imgError, setImgError] = useState(false);

    if (!imgError && src) {
        return (
            <img
                src={src}
                alt={alt}
                width={size}
                height={size}
                className={className}
                style={{ objectFit: 'contain', display: 'inline-block' }}
                onError={() => setImgError(true)}
                loading="lazy"
            />
        );
    }
};

export default Logo;
