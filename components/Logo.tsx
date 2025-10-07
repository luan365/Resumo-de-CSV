
import React from 'react';

export const Logo: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#818cf8', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#4f46e5', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path d="M32 2C15.432 2 2 15.432 2 32C2 48.568 15.432 62 32 62C48.568 62 62 48.568 62 32C62 15.432 48.568 2 32 2Z" fill="url(#logo-gradient)"/>
        <path d="M24.5 22H39.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.5 32H39.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24.5 42H31.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
